import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from '../address/address.module';
import { District } from '../address/district.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { Billboard } from './billboard.entity';
import { BillboardsController } from './billboards.controller';
import { BillboardsService } from './billboards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Billboard, District, User]),
    AddressModule,
    UsersModule,
  ],
  controllers: [BillboardsController],
  providers: [BillboardsService],
  exports: [BillboardsService],
})
export class BillboardsModule {}
