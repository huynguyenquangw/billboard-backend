import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { Contract } from 'src/modules/api/contracts/entities/contract.entity';
import { PrivateFile } from 'src/modules/api/contracts/entities/privateFile.entity';
import { Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';

@Injectable()
export class S3PrivateService {
  constructor(
    @InjectRepository(PrivateFile)
    private _privateFileRepo: Repository<PrivateFile>,
    @InjectRepository(Billboard)
    private _billboardRepository: Repository<Billboard>,
    private readonly _configService: ConfigService,
  ) {}

  /**
   * Get presigned URL of file
   * @param key
   * @returns s3 response
   */
  public async generatePresignedUrl(key: string) {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: this._configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
    });
  }

  /**
   * Save file into DB
   * @param contract
   * @param file
   * @returns s3 response
   */
  async uploadPrivateFileS3(
    contract: Contract,
    file: Express.Multer.File,
  ): Promise<any> {
    const param = {
      Bucket: this._configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: `billboards/contracts/${contract.id}/${uuid()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Get s3Response list after upload to S3
    const s3 = new S3();
    const s3UploadResponse = await s3.upload(param).promise();

    return s3UploadResponse;
  }

  /**
   * Save file into DB
   * @param contract
   * @param s3UploadResponses
   * @returns saved file
   */
  async saveFileIntoDatabase(
    contract: Contract,
    s3UploadResponse: any,
  ): Promise<any> {
    const newFile = await this._privateFileRepo.create({
      url: s3UploadResponse.Location,
      key: s3UploadResponse.Key,
      contract,
    });

    const dbUploadResponse = await this._privateFileRepo.save(newFile);
    return dbUploadResponse;
  }

  /**
   * DELETE files from S3
   * @param contract
   */
  async deleteFileFromS3(contract: Contract) {
    const oldFile = contract.privateFile;

    // DELETE old pics from S3
    const s3 = new S3();

    const s3DeleteResponse = await s3.deleteObject({
      Bucket: this._configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: oldFile.key,
    });

    return await s3DeleteResponse;
  }

  /**
   * DELETE files from DB
   * @param contract
   */
  async deleteFileFromDatabase(contract: Contract) {
    const oldFile = contract.privateFile;

    // DELETE old file from DB
    const dbDeleteResponse = await this._privateFileRepo.delete(oldFile.id);

    return dbDeleteResponse;
  }

  /**
   * TODO: USING
   * @param contract
   * @param files
   * @returns
   */
  async isContractPrivateFileUpdated(
    contract: Contract,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Bad request');
    }

    const currentFile = contract.privateFile;

    // 1. Upload file to S3
    // 2. Upload file to DB
    // 3. Delete old file from DB <- res of flow from here
    // 4. Delete old file from S3

    // 1
    const s3UploadResponse = await this.uploadPrivateFileS3(contract, file);

    // 2
    const dbUploadResponse = await this.saveFileIntoDatabase(
      contract,
      s3UploadResponse,
    );
    if (!dbUploadResponse) {
      return false;
    }

    // check update case
    if (currentFile) {
      const dbDeleteResponse = await this.deleteFileFromDatabase(contract);
      const s3DeleteResponse = await this.deleteFileFromS3(contract);

      if (dbDeleteResponse) {
        return true;
      }
    }
    if (!currentFile) {
      return true;
    }
  }
}
