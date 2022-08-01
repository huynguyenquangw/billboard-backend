import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { File } from 'src/modules/api/infra/database/entities/file.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
// import mime from 'mime-types';

// import type { IFile } from '../../interfaces';
// import { ApiConfigService } from './api-config.service';
// import { GeneratorService } from './generator.service';

@Injectable()
export class S3Service {
  constructor(
    @InjectRepository(File)
    private _fileRepository: Repository<File>,
    private readonly _configService: ConfigService,
  ) {}

  async uploadFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this._configService.get('AWS_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this._fileRepository.create({
      url: uploadResult.Location,
      key: uploadResult.Key,
    });
    await this._fileRepository.save(newFile);
    return newFile;
  }
  // private readonly s3: AWS.S3;
  // constructor(
  //   public configService: ApiConfigService,
  //   public generatorService: GeneratorService,
  // ) {
  //   const awsS3Config = configService.awsS3Config;
  //   const options: AWS.S3.Types.ClientConfiguration = {
  //     // apiVersion: awsS3Config.bucketApiVersion,
  //     region: awsS3Config.bucketRegion,
  //   };
  //   this.s3 = new AWS.S3(options);
  // }
  // async uploadImage(file: File): Promise<string> {
  //   // const fileName = this.generatorService.fileName(
  //   //   <string>mime.extension(file.mimetype),
  //   // );
  //   // const key = 'images/' + fileName;
  //   await this.s3
  //     .putObject({
  //       Bucket: this.configService.awsS3Config.bucketName,
  //       Body: file.buffer,
  //       ACL: 'public-read',
  //       Key: key,
  //     })
  //     .promise();
  //   return key;
  // }
}
