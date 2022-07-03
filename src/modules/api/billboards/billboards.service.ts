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

  getAllbyAddress2(selectedAdrress2 :string ): Promise<BillboardEnity[]> {
    return this.billboardRepo.find({where:{address2: selectedAdrress2}});
  }

  async getOnebyId(findId: string): Promise<BillboardEnity> {
    return await this.billboardRepo.findOne({ where: { id: findId } });
  }

  getAll(): Promise<BillboardEnity[]> {
    return this.billboardRepo.find();
  }

  async updateBillboard(getId: string, name: string): Promise<BillboardEnity> {
    const selectedBillboard = await this.getOnebyId(getId);

    selectedBillboard.name = name;
    return this.billboardRepo.save(selectedBillboard);
  }

  async deleteBillboard(getId: string): Promise<BillboardEnity> {
    const selectedBillboard = await this.getOnebyId(getId);

    return await this.billboardRepo.remove(selectedBillboard);
  }
}
