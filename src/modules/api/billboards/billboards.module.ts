import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from '../address/address.module';
import { DistrictEntity } from '../address/district.entity';
import { UserEntity } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { BillboardEnity } from './billboard.entity';
import { BillboardsController } from './billboards.controller';
import { BillboardsService } from './billboards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillboardEnity, DistrictEntity, UserEntity]),
    AddressModule,
    UsersModule,
  ],
  controllers: [BillboardsController],
  providers: [BillboardsService],
})
export class BillboardsModule {}
