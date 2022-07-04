import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { District } from './district.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateDistrictDto } from './dto/create-district.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { Ward } from './ward.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(City)
    private cityRepo: Repository<City>,
    @InjectRepository(District)
    private districtRepo: Repository<District>,
    @InjectRepository(Ward)
    private wardRepo: Repository<Ward>,
  ) {}

  /**
   * City
   */
  async getAllCities(): Promise<City[]> {
    const cities = await this.cityRepo.find();
    if (!cities) {
      throw new NotFoundException();
    }
    return cities;
  }

  async getOneCity(id: string): Promise<City> {
    const city = await this.cityRepo.findOne({
      where: { id },
      relations: { districts: true },
    });
    if (!city) {
      throw new NotFoundException(id);
    }
    return city;
  }

  async createCity(city: CreateCityDto): Promise<City> {
    const newCity = await this.cityRepo.create({ ...city });
    if (!newCity) {
      throw new BadRequestException();
    }
    return await this.cityRepo.save(newCity);
  }

  /**
   * District
   */
  async getAllDistricts(): Promise<District[]> {
    const districts = await this.districtRepo.find();
    if (!districts) {
      throw new NotFoundException();
    }
    return districts;
  }

  async getAllDistrictsByCityId(cityId: string): Promise<District[]> {
    const city = await this.cityRepo.findOne({
      where: { id: cityId },
      relations: { districts: true },
    });
    if (!city) {
      throw new NotFoundException(cityId);
    }
    return city.districts;
  }

  async getOneDistrict(id: string): Promise<District> {
    const district = await this.districtRepo.findOne({
      where: { id },
      relations: { city: true },
    });
    if (!district) {
      throw new NotFoundException(id);
    }
    return district;
  }

  async createDistrict(district: CreateDistrictDto): Promise<District> {
    const { cityId, ...districtToCreate } = district;
    const city = await this.cityRepo.findOne({
      where: { id: cityId },
    });

    const newDistrict = await this.districtRepo.create({
      ...districtToCreate,
      city: city,
    });
    return await this.districtRepo.save(newDistrict);
  }

  /**
   * Ward
   */
  async getOneWard(id: string): Promise<Ward> {
    const ward = await this.wardRepo.findOne({
      where: { id },
      relations: ['district'],
    });
    if (!ward) {
      throw new NotFoundException(id);
    }
    return ward;
  }

  async getAllWards(): Promise<Ward[]> {
    return this.wardRepo.find();
  }

  async getAllWardsByDistrictId(districtId: string): Promise<Ward[]> {
    const district = await this.districtRepo.findOne({
      where: { id: districtId },
      relations: ['wards'],
    });
    if (!district) {
      throw new NotFoundException(districtId);
    }
    return district.wards;
  }

  async createWard(ward: CreateWardDto): Promise<Ward> {
    const { districtId, ...wardToCreate } = ward;
    const district = await this.districtRepo.findOne({
      where: { id: districtId },
    });

    const newWard = await this.wardRepo.create({
      ...wardToCreate,
      district: district,
    });
    return await this.wardRepo.save(newWard);
  }
}
