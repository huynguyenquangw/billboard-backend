import { Controller } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('api/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // @Get('create/district')
  // async addDistrict() {
  //   await this.addressService.createDistrict();

  //   return 'Create Complete';
  // }
}
