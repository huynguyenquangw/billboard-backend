import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Point } from 'geojson';
import { In, Repository } from 'typeorm';
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
  ) {}

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

  async createDistricts(
    districts: Array<CreateDistrictDto>,
  ): Promise<District[]> {
    const city = await this.cityRepository.findOne({
      where: { id: districts[0].cityId },
    });
    const newDistricts = [];
    districts.forEach(async (district) => {
      const newDistrict = await this.districtRepository.create({
        ...district,
        city: city,
      });
      newDistricts.push(await this.districtRepository.save(newDistrict));
    });

    return newDistricts;
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

  async getAllDistrictsOfHcm(): Promise<District[]> {
    const city: City = await this.cityRepository.findOne({
      where: { name: 'Ho Chi Minh City' },
      relations: ['districts'],
    });
    if (!city) {
      throw new NotFoundException('No city');
    }
    return city.districts;
  }

  async deleteDistricts(ids: Array<string>) {
    return await this.districtRepository.delete({
      id: In(ids),
    });
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

  async createWards(wards: Array<CreateWardDto>): Promise<Ward[]> {
    // const district = await this.districtRepository.findOne({
    //   where: { id: wards[0].districtId },
    // });
    const newWards = [];
    wards.forEach(async (ward) => {
      const { districtId, ...wardToCreate } = ward;
      const district = await this.districtRepository.findOne({
        where: { id: districtId },
      });

      const newWard = await this.wardRepository.create({
        ...ward,
        district: district,
      });
      newWards.push(await this.wardRepository.save(newWard));
    });

    return newWards;
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

  async deleteWards(ids: Array<string>) {
    return await this.wardRepository.delete({
      id: In(ids),
    });
  }
}
