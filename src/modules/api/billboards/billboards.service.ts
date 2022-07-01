import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistrictEntity } from '../address/district.entity';
import { UserEntity } from '../users/user.entity';
import { BillboardEnity } from './billboard.entity';
import { BillboardDto } from './dto/create-billboard.dto';

@Injectable()
export class BillboardsService {
  constructor(
    @InjectRepository(BillboardEnity)
    private billboardRepo: Repository<BillboardEnity>,
    @InjectRepository(DistrictEntity)
    private districtRepo: Repository<DistrictEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}
  //TODO fix DTO and entity of billboard

  async createbillBoard(billboardDto: BillboardDto): Promise<BillboardEnity> {

    // const district1 = await this.districtRepo.findOne({
    //   where: { id: billboardDto.districtId },
    // });
    // const user1 = await this.userRepo.findOne({
    //   where: { id: billboardDto.userId },
    // });
    const billboard1 = this.billboardRepo.create({
      // user: user1,
      // district: district1,
      address: billboardDto.address,
      address2: billboardDto.address2,
      name: billboardDto.name,
      picture: billboardDto.picture,
      video: billboardDto.video,
      size_x: billboardDto.size_x,
      size_y: billboardDto.size_y,
      circulation: billboardDto.circulation,
      previousClient: billboardDto.previousClient,
      rentalPrice: billboardDto.rentalPrice,
      rentalDuration: billboardDto.rentalDuration,
      description: billboardDto.description,
      status: billboardDto.status,
    });
    return this.billboardRepo.save(billboard1);
  }

  getAll(selectedAdrress2 :string ): Promise<BillboardEnity[]> {
    return this.billboardRepo.find({where:{address2: selectedAdrress2}});
  }

  // async getOnebyId(findId: number): Promise<BillboardEnity> {
  //   return await this.billboardRepo.findOne({ where: { id: findId } });
  // }

  // async getFourbyId(
  //   findId1: number,
  //   findId2: number,
  //   findId3: number,
  //   findId4: number,
  // ): Promise<BillboardEnity[]> {
  //   const findBillboard1 = await this.billboardRepo.findOne({
  //     where: { id: findId1 },
  //   });
  //   const findBillboard2 = await this.billboardRepo.findOne({
  //     where: { id: findId2 },
  //   });
  //   const findBillboard3 = await this.billboardRepo.findOne({
  //     where: { id: findId3 },
  //   });
  //   const findBillboard4 = await this.billboardRepo.findOne({
  //     where: { id: findId4 },
  //   });

  //   return [findBillboard1, findBillboard2, findBillboard3, findBillboard4];
  // }

  // async updateBillboard(getId: number, name: string): Promise<BillboardEnity> {
  //   const selectedBillboard = await this.getOnebyId(getId);

  //   selectedBillboard.name = name;
  //   return this.billboardRepo.save(selectedBillboard);
  // }

  // async deleteBillboard(getId: number): Promise<BillboardEnity> {
  //   const selectedBillboard = await this.getOnebyId(getId);

  //   return await this.billboardRepo.remove(selectedBillboard);
  // }
}
