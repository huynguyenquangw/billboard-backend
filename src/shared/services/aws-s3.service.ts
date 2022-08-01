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

  /**
   * Upload a file
   * @param dataBuffer
   * @param filename
   * @returns
   */
  async uploadFile(dataBuffer: Buffer, filename: string) {
    const bucket = this._configService.get('AWS_BUCKET_NAME');
    const s3 = new S3();

    // Upload to S3
    const uploadResult = await s3
      .upload({
        Bucket: bucket,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    // Save into DB
    const newFile = this._fileRepository.create({
      url: uploadResult.Location,
      key: uploadResult.Key,
    });
    await this._fileRepository.save(newFile);

    return newFile;
  }

  /**
   * Upload multiple files
   * @param dataBuffer
   * @param filename
   * @returns
   */
  async uploadMultipleFiles(files: Array<Express.Multer.File>) {
    const responses = [];
    const bucket = this._configService.get('AWS_BUCKET_NAME');

    const s3 = new S3();
    // const uploadResult = await s3
    //   .upload({
    //     Bucket: this._configService.get('AWS_BUCKET_NAME'),
    //     Body: dataBuffer,
    //     Key: `${uuid()}-${filename}`,
    //   })
    //   .promise();

    files.forEach(async (file) => {
      const fileParams = {
        Bucket: bucket,
        Key: `${uuid()}-${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: 'ap-southeast-1',
        },
      };

      try {
        const s3Response = await s3.upload(fileParams).promise();

        // console.log(s3Response);

        const newFile = this._fileRepository.create({
          url: s3Response.Location,
          key: s3Response.Key,
        });
        await this._fileRepository.save(newFile);
        responses.push(s3Response);
      } catch (e) {
        console.log(e);
      }
    });

    // const uploadMultipleFilesS3 = (file) => {
    //   const params = {
    //     Bucket: bucket,
    //     Key: String(name),
    //     Body: file.buffer,
    //     ACL: 'public-read',
    //     ContentType: file.mimetype,
    //     ContentDisposition: 'inline',
    //     // CreateBucketConfiguration: {
    //     //   LocationConstraint: 'ap-south-1',
    //     // },
    //   };
    //   return s3.upload(params).promise();
    // };

    return responses;
  }

  /**
   * TODO:
   * Test
   * @param file
   * @returns
   */
  async testUpload(file: Express.Multer.File): Promise<any> {
    const bucket = this._configService.get('AWS_BUCKET_NAME');
    const responses = [];
    const s3 = new S3();

    try {
      // Upload to S3
      const uploadResponse = await s3
        .upload({
          Bucket: bucket,
          Body: file.buffer,
          Key: `${uuid()}-${file.originalname}`,
        })
        .promise();

      // Save into DB
      const fileToSave = this._fileRepository.create({
        url: uploadResponse.Location,
        key: uploadResponse.Key,
      });
      await this._fileRepository.save(fileToSave);
    } catch (error) {
      console.error(error);
    }

    return responses;
  }

  // upload
  async upload(files: Array<Express.Multer.File>) {
    const bucket = this._configService.get('AWS_BUCKET_NAME');

    const s3bucket = new S3({
      accessKeyId: this._configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this._configService.get('AWS_SECRET_ACCESS_KEY'),
      // Bucket: 'rmit-billboard-bucket',
    });

    const ResponseData = [];
    s3bucket.createBucket(async () => {
      const Bucket_Path = 'BUCKET_PATH';
      //Where you want to store your file

      files.map(async (item) => {
        const params = {
          Bucket: bucket,
          Key: item.originalname,
          Body: item.buffer,
          ACL: 'public-read',
        };

        try {
          const s3Response = await s3bucket.upload(params);

          ResponseData.push(s3Response);

          if (ResponseData.length == files.length) {
            return {
              error: false,
              Message: 'File Uploaded Successfully',
              Data: ResponseData,
            };
          }
        } catch (error) {
          console.error(error);
        }

        // s3bucket.upload(params, function (err, data) {
        //   if (err) {
        //     res.json({ error: true, Message: err });
        //   } else {
        //     ResponseData.push(data);
        //     if (ResponseData.length == files.length) {
        //       res.json({
        //         error: false,
        //         Message: 'File Uploaded Successfully',
        //         Data: ResponseData,
        //       });
        //     }
        //   }
        // });
      });
    });
    console.log(1, ResponseData.length);
  }
}
