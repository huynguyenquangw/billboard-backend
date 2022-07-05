import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { City } from './city.entity';
import { District } from './district.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateDistrictDto } from './dto/create-district.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { Ward } from './ward.entity';

@Controller('api')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  /**
   * City
   */
  @Post('cities')
  @ApiOperation({ summary: 'Create a new city' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateCityDto,
    description: 'Successfully create a new city',
  })
  async createCity(@Body() city: CreateCityDto): Promise<City> {
    await console.log('city: ', city);
    return this.addressService.createCity(city);
  }

  @Get('cities/:id')
  getOneCity(@Param('id') id: string): Promise<City> {
    return this.addressService.getOneCity(id);
  }

  @Get('cities')
  getAllCities(): Promise<City[]> {
    return this.addressService.getAllCities();
  }

  @Get('cities/:id/districts')
  getAllDistrictsWithinACity(@Param('id') id: string): Promise<District[]> {
    return this.addressService.getAllDistrictsByCityId(id);
  }

  /**
   * District
   */
  @Post('districts')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateDistrictDto,
    description: 'Successfully create a new district',
  })
  async createDistrict(@Body() district: CreateDistrictDto): Promise<District> {
    return this.addressService.createDistrict(district);
  }

  @Get('districts/:id')
  getOneDistrict(@Param('id') id: string): Promise<District> {
    return this.addressService.getOneDistrict(id);
  }

  @Get('districts/:id/wards')
  getAllWardsWithinADistrict(@Param('id') id: string): Promise<Ward[]> {
    return this.addressService.getAllWardsByDistrictId(id);
  }

  // @Get('districts/all')
  // getAllDistricts(): Promise<District[]> {
  //   return this.addressService.getAllDistricts();
  // }

  /**
   * Ward
   */
  @Post('wards')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateWardDto,
    description: 'Successfully create a new ward',
  })
  async createWard(@Body() ward: CreateWardDto): Promise<Ward> {
    return this.addressService.createWard(ward);
  }

  @Get('wards/:id')
  getOneWard(@Param('id') id: string): Promise<Ward> {
    return this.addressService.getOneWard(id);
  }

  // @Get('wards/all')
  // getAllWards(): Promise<Ward[]> {
  //   return this.addressService.getAllWards();
  // }
}
