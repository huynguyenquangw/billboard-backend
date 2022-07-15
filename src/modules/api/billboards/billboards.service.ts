import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { StatusType } from 'src/constants';
import { Repository } from 'typeorm';
import { AddressService } from '../address/address.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Billboard } from './billboard.entity';
import { BillboardInfoDto } from './dto/billboard-info.dto';
import { CreateBillboardDto } from './dto/create-billboard.dto';

@Injectable()
export class BillboardsService {
  constructor(
    @InjectRepository(Billboard)
    private billboardRepository: Repository<Billboard>,
    private readonly addressService: AddressService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a billboard
   */
  async create(
    ownerId: string,
    createBillboardDto: CreateBillboardDto,
  ): Promise<Billboard> {
    const owner: User = await this.usersService.getUserById(ownerId);
    if (!owner) {
      throw new NotFoundException(ownerId);
    }

    const ward = await this.addressService.getOneWard(
      createBillboardDto.wardId,
    );

    const newBillboard: Billboard = await this.billboardRepository.create({
      ...createBillboardDto,
      owner: owner,
      ward: ward,
    });

    await this.billboardRepository.save(newBillboard);
    return newBillboard;
  }

  //Search and get all billboard by address2, rentalPrice, size_x, size_y, district(not done)
  async search(
    pageOptionsDto: PageOptionsDto,
    selectedAdrress2: string,
    selectedPrice: number,
    selectedSize_x: number,
    selectedSize_y: number,
    selectedDistrict: string,
  ): Promise<PageDto<BillboardInfoDto>> {
    const searchBillboard= await this.billboardRepository.findAndCount({
      order:{
        createdAt: pageOptionsDto.order,
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      relations: ['ward', 'ward.district', 'ward.district.city'],
      where: {
        address2: selectedAdrress2,
        rentalPrice: selectedPrice,
        size_x: selectedSize_x,
        size_y: selectedSize_y,
        status: StatusType.APPROVED,
        ward: {
          district: {
            name: selectedDistrict,
          },
        },
      },
    });

    const itemCount =searchBillboard[1];
    const pageMetaDto = new PageMetaDto({itemCount, pageOptionsDto});

    return new PageDto(searchBillboard[0], pageMetaDto)
  }

  //Get one billboard by id for detail page and other function
  async getOneById(findId: string): Promise<Billboard> {
    return await this.billboardRepository.findOne({
      where: { id: findId },
      withDeleted: true,
      relations: ['ward', 'ward.district', 'ward.district.city', 'owner'],
    });
  }

  //Get all approved billboard
  async getAllApproved(): Promise<Billboard[]> {
    return this.billboardRepository.find({
      where: { status: StatusType.APPROVED },
      relations: ['ward', 'ward.district', 'ward.district.city'],
    });
  }

  //Reject a billboard
  async rejectBillboard(getId: string): Promise<Billboard> {
    const selectedBillboard = await this.getOneById(getId);

    selectedBillboard.status = StatusType.REJECTED;
    return this.billboardRepository.save(selectedBillboard);
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
   * Get approved billboard list
   *
   */
  async getApprovedBillboards(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this.billboardRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('billboards.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .leftJoinAndSelect('billboards.ward', 'wards')
      .leftJoinAndSelect('wards.district', 'districts')
      .leftJoinAndSelect('districts.city', 'citys')
      .where({ status: StatusType.APPROVED, isRented: false });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Get billboard list by price
   */
  async getAllFilteredByPrice(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this.billboardRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('billboards.rentalPrice', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where({ status: StatusType.APPROVED, isRented: false });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Get billboard list by circulation
   */
  async getAllFilteredByCirculation(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this.billboardRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('billboards.circulation', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where({ status: StatusType.APPROVED, isRented: false });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Get draft billboard list
   */
  async getDraftBillboards(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this.billboardRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('billboards.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where({ status: StatusType.DRAFT, isRented: false });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Get pending billboard list
   */
  async getPendingBillboards(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this.billboardRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('billboards.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where({ status: StatusType.PENDING, isRented: false });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Get reject billboard list
   */
  async getRejectBillboards(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this.billboardRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('billboards.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where({ status: StatusType.PENDING, isRented: false });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Get rented billboard list
   */
  async getRentedBillboards(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this.billboardRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('billboards.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where({ status: StatusType.APPROVED, isRented: true });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
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
