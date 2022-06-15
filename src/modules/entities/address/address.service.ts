import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistrictEntity } from './district.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(DistrictEntity)
    private districtRepo: Repository<DistrictEntity>,
  ) {}

  async createDistrict() {
    const district1 = this.districtRepo.create({
      name: 'District 7',
      abbreviation: 'D7',
      zip: '72900',
    });
    await this.districtRepo.save(district1);

    const district2 = this.districtRepo.create({
      name: 'District 1',
      abbreviation: 'D1',
      zip: '71000',
    });
    await this.districtRepo.save(district2);
  }
}
