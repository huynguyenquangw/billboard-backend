import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from 'src/shared/services/aws-s3.service';
import { AddressModule } from '../address/address.module';
import { District } from '../address/district.entity';
import { PlansModule } from '../plans/plans.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { Billboard } from './billboard.entity';
import { BillboardsController } from './billboards.controller';
import { BillboardsService } from './billboards.service';
import { Picture } from './entities/picture.entity';
import { PreviousClient } from './previousClients.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Billboard,
      PreviousClient,
      District,
      User,
      Picture,
    ]),
    AddressModule,
    UsersModule,
    PlansModule,
  ],
  controllers: [BillboardsController],
  providers: [BillboardsService, S3Service],
  exports: [BillboardsService],
})
export class BillboardsModule {}
