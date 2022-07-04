import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { Repository } from 'typeorm';
import { District } from '../address/district.entity';
import { User } from '../users/user.entity';
import { Billboard } from './billboard.entity';
import { BillboardDto } from './dto/create-billboard.dto';

@Injectable()
export class BillboardsService {
  constructor(
    @InjectRepository(Billboard)
    private billboardRepo: Repository<Billboard>,
    @InjectRepository(District)
    private districtRepo: Repository<District>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }
  // TODO fix DTO and entity of billboard

  //Create a new billboard
  async createbillBoard(billboardDto: BillboardDto): Promise<Billboard> {
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
    });
    return this.billboardRepo.save(billboard1);
  }

  //Search and get all billboard by address2
  async getAllbyAddress2(selectedAdrress2: string): Promise<Billboard[]> {
    return this.billboardRepo.find({
      where: { address2: selectedAdrress2 },
      withDeleted: true,
    });
  }

  //Get one billboard by id for detail page and other function 
  async getOnebyId(findId: string): Promise<Billboard> {
    return await this.billboardRepo.findOne({
      where: { id: findId },
      withDeleted: true
    });
  }

  //Get all approved billboard
  async getAllApproved(): Promise<Billboard[]> {
    return this.billboardRepo.find({
      where: { status: StatusType.APPROVED },
      withDeleted: true
    });
  }

  //Approve a billboard 
  async approveBillboard(getId: string): Promise<Billboard>{
    const selectedBillboard = await this.getOnebyId(getId);

    selectedBillboard.status = StatusType.APPROVED;
    return this.billboardRepo.save(selectedBillboard);
  }

  //Get all billboard 
  async getAllWithDeleted(): Promise<Billboard[]> {
    return this.billboardRepo.find({
      withDeleted: true
    });
  }

  //Get all non soft deleted billboard 
  async getAll(): Promise<Billboard[]> {
    return this.billboardRepo.find();
  }

  //Update for one bill board (right now it's just name )
  async updateBillboard(getId: string, name: string): Promise<Billboard> {
    const selectedBillboard = await this.getOnebyId(getId);

    selectedBillboard.name = name;
    return this.billboardRepo.save(selectedBillboard);
  }

  //Completely delete a billboard from database
  async hardDeleteBillboard(getId: string): Promise<Billboard> {
    const selectedBillboard = await this.getOnebyId(getId);

    return await this.billboardRepo.remove(selectedBillboard);
  }

  //Soft Delete a billobard
  async softDeleteBillboard(getId: string) {
    const deleteResponse = await this.billboardRepo.softDelete(getId);
    if (!deleteResponse.affected) {
      // throw new UserNotFoundException(id);
      throw new NotFoundException(getId);
    } else {
      return deleteResponse;
    }
  }

  //Restore Soft Delete billboard
  async restoreSoftDeleteBillboard(getId: string) {
    const restoreResponse = await this.billboardRepo.restore(getId);
    if (!restoreResponse.affected) {
      throw new NotFoundException(getId);
    } else {
      return restoreResponse;
    }
  }
}
