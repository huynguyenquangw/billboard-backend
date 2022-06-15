import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { DistrictEntity } from "./district.entity";



@Module({
    imports:[TypeOrmModule.forFeature([DistrictEntity])],
    controllers: [AddressController],
    providers: [AddressService],
  })
  export class AddressModule {}