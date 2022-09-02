import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3PrivateService } from 'src/shared/services/aws-s3-private.service';
import { Billboard } from '../billboards/billboard.entity';
import { BillboardsModule } from '../billboards/billboards.module';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';
import { PrivateFile } from './entities/privateFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract, Billboard, PrivateFile]),
    BillboardsModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService, S3PrivateService],
  exports: [ContractsService],
})
export class ContractsModule {}
