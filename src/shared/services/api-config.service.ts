import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  // ------------
  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
  // ------------

  get typeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getString('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      database: this.getString('DATABASE_NAME'),
      username: this.getString('DATABASE_USER'),
      password: this.getString('DATABASE_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: true, // never use TRUE in production!
    };
  }

  //   get postgresConfig(): TypeOrmModuleOptions {
  //     let entities = [
  //       __dirname + '/../../modules/**/*.entity{.ts,.js}',
  //       __dirname + '/../../modules/**/*.view-entity{.ts,.js}',
  //     ];
  //     let migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

  //     if (module.hot) {
  //       const entityContext = require.context(
  //         './../../modules',
  //         true,
  //         /\.entity\.ts$/,
  //       );
  //       entities = entityContext.keys().map((id) => {
  //         const entityModule = entityContext<Record<string, unknown>>(id);
  //         const [entity] = Object.values(entityModule);

  //         return entity as string;
  //       });
  //       const migrationContext = require.context(
  //         './../../database/migrations',
  //         false,
  //         /\.ts$/,
  //       );

  //       migrations = migrationContext.keys().map((id) => {
  //         const migrationModule = migrationContext<Record<string, unknown>>(id);
  //         const [migration] = Object.values(migrationModule);

  //         return migration as string;
  //       });
  //     }

  //     return {
  //       entities,
  //       migrations,
  //       keepConnectionAlive: !this.isTest,
  //       dropSchema: this.isTest,
  //       type: 'postgres',
  //       name: 'default',
  //       host: this.getString('DB_HOST'),
  //       port: this.getNumber('DB_PORT'),
  //       username: this.getString('DB_USERNAME'),
  //       password: this.getString('DB_PASSWORD'),
  //       database: this.getString('DB_DATABASE'),
  //       subscribers: [UserSubscriber],
  //       migrationsRun: true,
  //       logging: this.getBoolean('ENABLE_ORM_LOGS'),
  //       namingStrategy: new SnakeNamingStrategy(),
  //     };
  //   }

  // AWS S3
  //   get awsS3Config() {
  //     return {
  //       bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
  //       bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
  //       bucketName: this.getString('AWS_S3_BUCKET_NAME'),
  //     };
  //   }
}
