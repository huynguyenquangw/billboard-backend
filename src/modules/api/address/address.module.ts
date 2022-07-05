import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { City } from './city.entity';
import { District } from './district.entity';
import { Ward } from './ward.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([City, District, Ward])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
