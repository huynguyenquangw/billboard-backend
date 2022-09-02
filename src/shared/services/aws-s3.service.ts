import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { isArrayDifferent } from 'src/common/helper';
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
   * Save file into DB
   * @param billboard
   * @param file
   * @returns s3 response
   */
  async saveFilesIntoS3(
    billboard: Billboard,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
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

    // Get s3Response list after upload to S3
    const s3 = new S3();
    const s3UploadResponses = await Promise.all(
      params.map(async (param) => await s3.upload(param).promise()),
    );

    return s3UploadResponses;
  }

  /**
   * Save file into DB
   * @param billboard
   * @param s3UploadResponses
   * @returns saved file
   */
  async saveFilesIntoDatabase(
    billboard: Billboard,
    s3UploadResponses: any,
  ): Promise<any> {
    // if (s3FileResponses?.length === files.length) {
    const dbUploadResponses = [];
    await s3UploadResponses.forEach(async (picture) => {
      const newPicture = await this._pictureRepository.create({
        url: picture.Location,
        key: picture.Key,
        billboard,
      });
      const dbUploadResponse = await this._pictureRepository.save(newPicture);
      await dbUploadResponses.push(dbUploadResponse);
    });

    return dbUploadResponses;
  }

  /**
   * DELETE files from S3
   * @param billboard
   */
  async deleteFileFromS3(billboard: Billboard) {
    const oldPictures = billboard.pictures;

    // DELETE old pics from S3
    const s3 = new S3();
    const s3DeleteResponses = [];
    const oldPictureKeys = oldPictures.map((a) => a.key);
    await oldPictureKeys.forEach(async (key) => {
      const s3DeleteResponse = await s3.deleteObject({
        Bucket: this._configService.get('AWS_BUCKET_NAME'),
        Key: key,
      });
      await s3DeleteResponses.push(s3DeleteResponse);
    });

    return await s3DeleteResponses;
  }

  /**
   * DELETE files from DB
   * @param billboard
   */
  async deleteFileFromDatabase(billboard: Billboard) {
    const oldPictures = billboard.pictures;

    // DELETE old pics from DB
    const dbDeleteResponses = [];
    const oldPictureIds = oldPictures.map((a) => a.id);
    await oldPictureIds.forEach(async (id) => {
      const dbDeleteResponse = await this._pictureRepository.delete(id);
      await dbDeleteResponses.push(dbDeleteResponse);
    });
    return dbDeleteResponses;
  }

  /**
   * TODO: USING
   * @param billboard
   * @param files
   * @returns
   */
  async isBillboardFilesUpdated(
    billboard: Billboard,
    files: Array<Express.Multer.File>,
  ) {
    if (files?.length < 1) {
      throw new BadRequestException(
        'Uploading list is empty. A billboard must has at least 5 pictures',
      );
    }
    // Check if current billboard's pictures list
    // is different from
    // file list from request
    const currentPics = billboard.pictures;
    // if (currentPics.length !== files.length) {
    if (isArrayDifferent(files, currentPics)) {
      // 1. Upload new list to S3
      // 2. Upload new list to DB
      // 3. Delete old list from DB <- res of flow from here
      // 4. Delete old list from S3

      // 1
      const s3UploadResponses = await this.saveFilesIntoS3(billboard, files);
      // if (!s3UploadResponses) {
      //   return false;
      // }

      // 2
      const dbUploadResponses = await this.saveFilesIntoDatabase(
        billboard,
        s3UploadResponses,
      );
      if (!dbUploadResponses) {
        return false;
      }

      // check update case
      if (currentPics.length !== 0) {
        console.log('Case: Update');

        const dbDeleteResponses = await this.deleteFileFromDatabase(billboard);
        const s3DeleteResponses = await this.deleteFileFromS3(billboard);

        if (dbDeleteResponses) {
          return true;
        }
      }
      if (currentPics.length === 0) {
        console.log('Case: Add');
      }

      return true;
    }
    return false;

    // // ADD new pictures into S3 and DB
    // await this.addFiles(billboard, files);

    // // DELETE old pics from DB
    // const oldPictureIds = oldPictures.map((a) => a.id);
    // oldPictureIds.forEach((id) => {
    //   this._pictureRepository.delete(id);
    // });
    // const result = 'Update images successfully!';

    // // DELETE old pics from S3
    // const oldPictureKeys = oldPictures.map((a) => a.key);
    // oldPictureKeys.forEach((key) => {
    //   s3.deleteObject({
    //     Bucket: this._configService.get('AWS_BUCKET_NAME'),
    //     Key: key,
    //   });
    // });
    // return result;
  }

  // /**
  //  * Upload files list
  //  * @param billboardId
  //  * @param files
  //  * @returns s3 results
  //  */
  // async s3AddFiles(billboardId: string, files: Array<Express.Multer.File>) {
  //   // Save into DB
  //   const billboard = await this._billboardRepository.findOne({
  //     where: { id: billboardId },
  //   });
  //   if (!billboard) {
  //     throw new NotFoundException('Billboard with given id does not exist!');
  //   }
  //   const savedFiles = [];

  //   if (files) {
  //     const s3 = new S3();

  //     const params = files.map((file) => {
  //       return {
  //         Bucket: this._configService.get('AWS_BUCKET_NAME'),
  //         Key: `billboards/${billboardId}/${uuid()}-${file.originalname}`,
  //         Body: file.buffer,
  //         ACL: 'public-read',
  //         ContentType: file.mimetype,
  //         ContentDisposition: 'inline',
  //       };
  //     });

  //     // Get results list after upload to S3
  //     const results = await Promise.all(
  //       params.map((param) => s3.upload(param).promise()),
  //     );

  //     if (results?.length === files.length) {
  //       await results.forEach(async (result) => {
  //         const newFile = await this.saveFileIntoDatabase(billboard, result);
  //         savedFiles.push(newFile);
  //       });
  //     }
  //   }
  //   return await this._billboardRepository.findOne({
  //     where: { id: billboardId },
  //   });
  // }
}
