import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from '../address/address.module';
import { DistrictEntity } from '../address/district.entity';
import { UserEntity } from '../users/user.entity';
import { UserModule } from '../users/user.module';
import { BillboardController } from './billboard.controller';
import { BillboardEnity } from './billboard.entity';
import { BillboardService } from './billboard.service';

@Module({
  imports:[TypeOrmModule.forFeature([BillboardEnity, DistrictEntity, UserEntity]),
           AddressModule,
           UserModule,
  ],
  controllers: [BillboardController],
  providers: [BillboardService],
})
export class BillboardModule {}
