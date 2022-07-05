import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { Repository } from 'typeorm';
import { AddressService } from '../address/address.service';
import { Billboard } from './billboard.entity';
import { BillboardInfoDto } from './dto/billboard-info.dto';
import { CreateBillboardDto } from './dto/create-billboard.dto';

@Injectable()
export class BillboardsService {
  constructor(
    @InjectRepository(Billboard)
    private billboardRepository: Repository<Billboard>,
    private readonly addressService: AddressService,
  ) {}
  // TODO fix DTO and entity of billboard

  // Create a new billboard
  // async createbillBoard(billboardDto: CreateBillboardDto): Promise<Billboard> {
  //   // const district1 = await this.districtRepo.findOne({
  //   //   where: { id: billboardDto.districtId },
  //   // });
  //   // const user1 = await this.userRepo.findOne({
  //   //   where: { id: billboardDto.userId },
  //   // });
  //   const billboard1 = this.billboardRepository.create({
  //     // user: user1,
  //     // district: district1,
  //     address: billboardDto.address,
  //     address2: billboardDto.address2,
  //     name: billboardDto.name,
  //     picture: billboardDto.picture,
  //     video: billboardDto.video,
  //     size_x: billboardDto.size_x,
  //     size_y: billboardDto.size_y,
  //     circulation: billboardDto.circulation,
  //     previousClient: billboardDto.previousClient,
  //     rentalPrice: billboardDto.rentalPrice,
  //     rentalDuration: billboardDto.rentalDuration,
  //     description: billboardDto.description,
  //   });
  //   return this.billboardRepository.save(billboard1);
  // }

  /**
   * Create a billboard
   */
  async create(
    createBillboardDto: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    const newBillboard: Billboard = await this.billboardRepository.create({
      ...createBillboardDto,
    });

    await this.billboardRepository.save(newBillboard);
    return newBillboard.toDto();
  }

  //Search and get all billboard by address2
  async getAllbyAddress2(selectedAdrress2: string): Promise<Billboard[]> {
    return this.billboardRepository.find({
      where: { address2: selectedAdrress2 },
      withDeleted: true,
    });
  }

  //Get one billboard by id for detail page and other function
  async getOneById(findId: string): Promise<Billboard> {
    return await this.billboardRepository.findOne({
      where: { id: findId },
      withDeleted: true,
      relations: ['ward', 'ward.district', 'ward.district.city'],
    });
  }

  //Get all approved billboard
  async getAllApproved(): Promise<Billboard[]> {
    return this.billboardRepository.find({
      where: { status: StatusType.APPROVED },
    });
  }

  //Approve a billboard
  async approveBillboard(getId: string): Promise<Billboard> {
    const selectedBillboard = await this.getOneById(getId);

    selectedBillboard.status = StatusType.APPROVED;
    return this.billboardRepository.save(selectedBillboard);
  }

  //Get all billboard
  async getAllWithDeleted(): Promise<Billboard[]> {
    return this.billboardRepository.find({
      withDeleted: true,
    });
  }

  //Get all non soft deleted billboard
  async getAll(): Promise<Billboard[]> {
    return this.billboardRepository.find();
  }

  /**
   * Update a billboard
   */
  async update(
    id: string,
    body: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    const billboardToUpdate = await this.billboardRepository.findOne({
      where: { id },
    });

    if (!billboardToUpdate) {
      throw new NotFoundException();
    }

    let fullUpdateData = {};
    if (body.wardId) {
      const { wardId, ...updateData } = body;
      const ward = await this.addressService.getOneWard(wardId);

      fullUpdateData = { ...updateData, ward: { ...ward } };
    } else {
      fullUpdateData = body;
    }

    await this.billboardRepository.update(id, fullUpdateData);
    const updatedBillboard = await this.getOneById(id);
    return updatedBillboard.toDto();
  }

  //Update for one billboard (right now it's just name )
  // async updateBillboard(getId: string, name: string): Promise<Billboard> {
  //   const selectedBillboard = await this.getOneById(getId);

  //   selectedBillboard.name = name;
  //   return this.billboardRepository.save(selectedBillboard);
  // }

  //Completely delete a billboard from database
  async hardDeleteBillboard(getId: string): Promise<Billboard> {
    const selectedBillboard = await this.getOneById(getId);

    return await this.billboardRepository.remove(selectedBillboard);
  }

  //Soft Delete a billobard
  async softDeleteBillboard(getId: string) {
    const deleteResponse = await this.billboardRepository.softDelete(getId);
    if (!deleteResponse.affected) {
      // throw new UserNotFoundException(id);
      throw new NotFoundException(getId);
    } else {
      return deleteResponse;
    }
  }

  //Restore Soft Delete billboard
  async restoreSoftDeleteBillboard(getId: string) {
    const restoreResponse = await this.billboardRepository.restore(getId);
    if (!restoreResponse.affected) {
      throw new NotFoundException(getId);
    } else {
      return restoreResponse;
    }
  }
}
