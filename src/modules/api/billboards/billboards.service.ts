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

  /**
   * Create a billboard
   */
  async create(
    createBillboardDto: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    const findWard = await this.addressService.getOneWard(
      createBillboardDto.wardId,
    );

    const newBillboard: Billboard = await this.billboardRepository.create({
      ...createBillboardDto,
      ward: findWard,
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

  //Completely delete a billboard from database
  async hardDeleteBillboard(getId: string): Promise<Billboard> {
    const selectedBillboard = await this.getOneById(getId);

    return await this.billboardRepository.remove(selectedBillboard);
  }

  //Soft Delete a billobard
  async softDeleteBillboard(getId: string) {
    const deleteResponse = await this.billboardRepository.softDelete(getId);
    if (!deleteResponse.affected) {
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
