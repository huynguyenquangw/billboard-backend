import {
  Body,
  Controller,
  Delete,
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
  @Post('cities/create')
  @ApiOperation({ summary: 'Create a new city' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateCityDto,
    description: 'Successfully create a new city',
  })
  async createCity(@Body() city: CreateCityDto): Promise<City> {
    return this.addressService.createCity(city);
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Get 1 city' })
  getOneCity(@Param('id') id: string): Promise<City> {
    return this.addressService.getOneCity(id);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get all cities' })
  getAllCities(): Promise<City[]> {
    return this.addressService.getAllCities();
  }

  @Get('cities/hcm/districts')
  @ApiOperation({ summary: 'Get all districts of Ho Chi Minh City' })
  getAllDistrictsOfHcm(): Promise<District[]> {
    return this.addressService.getAllDistrictsOfHcm();
  }

  @Get('cities/:id/districts')
  @ApiOperation({ summary: 'Get all districts of a city' })
  getAllDistrictsWithinACity(@Param('id') id: string): Promise<District[]> {
    return this.addressService.getAllDistrictsByCityId(id);
  }

  /**
   * District
   */
  @Post('districts/create')
  @ApiOperation({ summary: 'create a new district' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateDistrictDto,
    description: 'Successfully create a new district',
  })
  async createDistrict(@Body() district: CreateDistrictDto): Promise<District> {
    return this.addressService.createDistrict(district);
  }

  @Get('districts/:id')
  @ApiOperation({ summary: 'Get 1 district' })
  getOneDistrict(@Param('id') id: string): Promise<District> {
    return this.addressService.getOneDistrict(id);
  }

  @Get('districts/:id/wards')
  @ApiOperation({ summary: 'Get all wards of a district' })
  getAllWardsOfADistrict(@Param('id') id: string): Promise<Ward[]> {
    return this.addressService.getAllWardsByDistrictId(id);
  }

  @Delete('districts/delete')
  @ApiOperation({ summary: 'Get all wards of a district' })
  deleteDistrict(@Body() ids: Array<string>): Promise<any> {
    return this.addressService.deleteDistricts(ids);
  }

  /**
   * Ward
   */
  @Post('wards/create')
  @ApiOperation({ summary: 'Create a new ward' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateWardDto,
    description: 'Successfully create a new ward',
  })
  async createWard(@Body() ward: CreateWardDto): Promise<Ward> {
    return this.addressService.createWard(ward);
  }

  @Get('wards/:id')
  @ApiOperation({ summary: 'Get 1 ward' })
  getOneWard(@Param('id') id: string): Promise<Ward> {
    return this.addressService.getOneWard(id);
  }
}
