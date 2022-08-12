import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { Picture } from 'src/modules/api/billboards/entities/picture.entity';
import { Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';
// import mime from 'mime-types';

// import type { IFile } from '../../interfaces';
// import { ApiConfigService } from './api-config.service';
// import { GeneratorService } from './generator.service';

@Injectable()
export class S3Service {
  constructor(
    @InjectRepository(Picture)
    private _pictureRepository: Repository<Picture>,
    @InjectRepository(Billboard)
    private _billboardRepository: Repository<Billboard>,
    private readonly _configService: ConfigService,
  ) {}

  /**
   * Upload files list
   * @param billboardId
   * @param files
   * @returns s3 results
   */
  async s3AddFiles(billboardId: string, files: Array<Express.Multer.File>) {
    // Save into DB
    const billboard = await this._billboardRepository.findOne({
      where: { id: billboardId },
    });
    if (!billboard) {
      throw new NotFoundException('Billboard with given id is not exist!');
    }
    const savedFiles = [];

    if (files) {
      const s3 = new S3();

      const params = files.map((file) => {
        return {
          Bucket: this._configService.get('AWS_BUCKET_NAME'),
          Key: `billboards/${billboardId}/${uuid()}-${file.originalname}`,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        };
      });

      // Get results list after upload to S3
      const results = await Promise.all(
        params.map((param) => s3.upload(param).promise()),
      );

      if (results?.length === files.length) {
        await results.forEach(async (result) => {
          const newFile = await this.saveFileIntoDatabase(billboard, result);
          savedFiles.push(newFile);
        });
      }
    }
    return await this._billboardRepository.findOne({
      where: { id: billboardId },
    });
  }

  async updateBillboardFiles(
    billboard: Billboard,
    files: Array<Express.Multer.File>,
  ) {
    const oldPictures = billboard.pictures;
    const s3 = new S3();

    // ADD new pictures into S3 and DB
    await this.addFiles(billboard, files);

    // DELETE
    oldPictures.forEach(async (picture) => {
      // from S3
      s3.deleteObject({
        Bucket: this._configService.get('AWS_BUCKET_NAME'),
        Key: picture.key,
      }).promise();

      // from DB
      await this._pictureRepository.delete(picture.id);
    });
  }

  async s3DeleteFile(id: string) {
    const fileToDelete = await this._pictureRepository.findOne({
      where: { id: id },
    });

    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this._configService.get('AWS_BUCKET_NAME'),
        Key: fileToDelete.key,
      })
      .promise();
    // Delete from DB also
    await this._pictureRepository.delete(id);
  }

  /**
   * Add files
   * -> S3
   * -> Database
   */
  async addFiles(billboard: Billboard, files: Array<Express.Multer.File>) {
    const savedFiles = [];

    if (files) {
      const s3 = new S3();

      const params = files.map((file) => {
        return {
          Bucket: this._configService.get('AWS_BUCKET_NAME'),
          Key: `billboards/${billboard.id}/${uuid()}-${file.originalname}`,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        };
      });

      // Get results list after upload to S3
      const results = await Promise.all(
        params.map((param) => s3.upload(param).promise()),
      );

      if (results?.length === files.length) {
        await results.forEach(async (result) => {
          const newFile = await this.saveFileIntoDatabase(billboard, result);
          savedFiles.push(newFile);
        });
      }
    }
    return savedFiles;
  }

  /**
   * Save file into DB
   * @param billboard
   * @param file
   * @returns saved file
   */
  async saveFileIntoDatabase(
    billboard: Billboard,
    s3FileResponse: any,
  ): Promise<any> {
    const newFile = await this._pictureRepository.create({
      url: s3FileResponse.Location,
      key: s3FileResponse.Key,
      billboard,
    });
    return await this._pictureRepository.save(newFile);
  }
}
