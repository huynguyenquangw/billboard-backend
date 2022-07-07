import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Point } from 'geojson';
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
    private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
  ) {} // private wardRepository: Repository<Ward>, // @InjectRepository(Ward) // private districtRepository: Repository<District>, // @InjectRepository(District) // private cityRepository: Repository<City>, // @InjectRepository(City)

  /**
   * Address
   */
  // async createAddress(): Promise<any> {
  //   const newCity = await this.cityRepository.create(hcm);
  //   if (!newCity) {
  //     throw new BadRequestException();
  //   }
  //   return await this.cityRepository.save(newCity);
  // }
  // async create(location: City) {
  //   const pointObject: Point = {
  //     type: 'Point',
  //     coordinates: [location.long, location.lat],
  //   };
  //   location.location = pointObject;
  //   return await this.cityRepository.save(location);
  // }

  /**
   * City
   */
  async createCity(city: CreateCityDto): Promise<City> {
    const newCity = await this.cityRepository.create({ ...city });
    if (!newCity) {
      throw new BadRequestException();
    }
    return await this.cityRepository.save(newCity);
  }

  async getOneCity(id: string): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['districts'],
    });
    if (!city) {
      throw new NotFoundException(id);
    }
    return city;
  }

  async getAllCities(): Promise<City[]> {
    const cities = await this.cityRepository.find();
    if (!cities) {
      throw new NotFoundException();
    }
    return cities;
  }

  /**
   * District
   */
  async createDistrict(district: CreateDistrictDto): Promise<District> {
    const { cityId, ...districtToCreate } = district;
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
    });

    const newDistrict = await this.districtRepository.create({
      ...districtToCreate,
      city: city,
    });
    return await this.districtRepository.save(newDistrict);
  }

  async getOneDistrict(id: string): Promise<District> {
    const district = await this.districtRepository.findOne({
      where: { id },
      relations: ['city', 'wards'],
    });
    if (!district) {
      throw new NotFoundException(id);
    }
    return district;
  }

  async getAllDistrictsByCityId(cityId: string): Promise<District[]> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['districts'],
    });
    if (!city) {
      throw new NotFoundException(cityId);
    }
    return city.districts;
  }

  /**
   * Ward
   */
  async createWard(ward: CreateWardDto): Promise<Ward> {
    const { districtId, ...wardToCreate } = ward;
    const district = await this.districtRepository.findOne({
      where: { id: districtId },
    });

    const newWard = await this.wardRepository.create({
      ...wardToCreate,
      district: district,
    });
    return await this.wardRepository.save(newWard);
  }

  async getOneWard(id: string): Promise<Ward> {
    const ward = await this.wardRepository.findOne({
      where: { id },
      relations: ['district', 'district.city'],
    });
    if (!ward) {
      throw new NotFoundException(id);
    }
    return ward;
  }

  async getAllWardsByDistrictId(districtId: string): Promise<Ward[]> {
    const district = await this.districtRepository.findOne({
      where: { id: districtId },
      relations: ['wards'],
    });
    if (!district) {
      throw new NotFoundException(districtId);
    }
    return district.wards;
  }
}
