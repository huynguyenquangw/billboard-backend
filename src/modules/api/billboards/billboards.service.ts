import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    private readonly billboardRepository: Repository<Billboard>,
    private readonly addressService: AddressService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Find only ONE billboard
   * by id
   */
  async findOne(id: string): Promise<Billboard> {
    const billboard: Billboard = await this.billboardRepository.findOne({
      where: { id: id },
    });
    if (billboard) {
      return billboard;
    }
    throw new NotFoundException(id);
  }

  /**
   * Find only ONE billboard
   * by id
   */
  async findOneWithRelations(id: string): Promise<Billboard> {
    return await this.billboardRepository.findOne({
      where: { id: id },
      relations: ['ward', 'ward.district', 'ward.district.city', 'owner'],
    });
  }

  /**
   *
   * TODO: move to use case
   * Find only ONE billboard
   * by id
   * include deleted
   */
  async findOneIncludeDeleted(id: string): Promise<Billboard> {
    return await this.billboardRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });
  }

  /**
   * Create a billboard
   */
  async create(
    ownerId: string,
    createBillboardDto: CreateBillboardDto,
  ): Promise<Billboard> {
    const owner: User = await this.usersService.findOne(ownerId);
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
    selectedAdrress2: string,
    selectedPrice: number,
    selectedSize_x: number,
    selectedSize_y: number,
    selectedDistrict: string,
  ): Promise<Billboard[]> {
    return this.billboardRepository.find({
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
      withDeleted: true,
    });
  }

  //Get all approved billboard
  async getAllApproved(): Promise<Billboard[]> {
    return this.billboardRepository.find({
      where: { status: StatusType.APPROVED },
      relations: ['ward', 'ward.district', 'ward.district.city'],
    });
  }

  /**
   * TODO: move to use case
   *
   */
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
   * Get approved billboard list within district
   *
   */
  // async getApprovedBillboardsWithinDistrict(): Promise<any> {
  //   const cityName = 'Ho Chi Minh City';
  //   // const districts = await this.districtRepository;

  //   const queryBuilder =
  //     this.billboardRepository.createQueryBuilder('billboards');

  //   queryBuilder
  //     .leftJoin('billboards.ward', 'wards')
  //     .leftJoin('wards.district', 'districts')
  //     .leftJoin('districts.city', 'cities')
  //     .where('cities.name = :name', { name: cityName })
  //     .andWhere({ status: StatusType.APPROVED, isRented: false })
  //     .select('districts.id', 'id')
  //     .addSelect('districts.name', 'name')
  //     .addSelect('districts.abbreviation', 'abbreviation')
  //     .addSelect('COUNT(DISTINCT(billboards.id)) as billboard_count')
  //     .groupBy('districts.id');

  //   const result = await queryBuilder.getRawMany();

  //   return result;
  // }

  // /**
  //  * Get approved billboard list
  //  *
  //  */
  // async getApprovedBillboards(
  //   pageOptionsDto: PageOptionsDto,
  // ): Promise<PageDto<BillboardInfoDto>> {
  //   const queryBuilder =
  //     this.billboardRepository.createQueryBuilder('billboards');

  //   queryBuilder
  //     .orderBy('billboards.createdAt', pageOptionsDto.order)
  //     .skip(pageOptionsDto.skip)
  //     .take(pageOptionsDto.take)
  //     .leftJoinAndSelect('billboards.ward', 'wards')
  //     .leftJoinAndSelect('wards.district', 'districts')
  //     .leftJoinAndSelect('districts.city', 'cities')
  //     .where({ status: StatusType.APPROVED, isRented: false });

  //   const itemCount = await queryBuilder.getCount();
  //   const { entities } = await queryBuilder.getRawAndEntities();

  //   const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  //   return new PageDto(entities, pageMetaDto);
  // }

  // /**
  //  * Get draft billboard list
  //  */
  // async getDraftBillboards(
  //   pageOptionsDto: PageOptionsDto,
  // ): Promise<PageDto<BillboardInfoDto>> {
  //   const queryBuilder =
  //     this.billboardRepository.createQueryBuilder('billboards');

  //   queryBuilder
  //     .orderBy('billboards.createdAt', pageOptionsDto.order)
  //     .skip(pageOptionsDto.skip)
  //     .take(pageOptionsDto.take)
  //     .where({ status: StatusType.DRAFT, isRented: false });

  //   const itemCount = await queryBuilder.getCount();
  //   const { entities } = await queryBuilder.getRawAndEntities();

  //   const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  //   return new PageDto(entities, pageMetaDto);
  // }

  // /**
  //  * Get pending billboard list
  //  */
  // async getPendingBillboards(
  //   pageOptionsDto: PageOptionsDto,
  // ): Promise<PageDto<BillboardInfoDto>> {
  //   const queryBuilder =
  //     this.billboardRepository.createQueryBuilder('billboards');

  //   queryBuilder
  //     .orderBy('billboards.createdAt', pageOptionsDto.order)
  //     .skip(pageOptionsDto.skip)
  //     .take(pageOptionsDto.take)
  //     .where({ status: StatusType.PENDING, isRented: false });

  //   const itemCount = await queryBuilder.getCount();
  //   const { entities } = await queryBuilder.getRawAndEntities();

  //   const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  //   return new PageDto(entities, pageMetaDto);
  // }

  // /**
  //  * Get reject billboard list
  //  */
  // async getRejectBillboards(
  //   pageOptionsDto: PageOptionsDto,
  // ): Promise<PageDto<BillboardInfoDto>> {
  //   const queryBuilder =
  //     this.billboardRepository.createQueryBuilder('billboards');

  //   queryBuilder
  //     .orderBy('billboards.createdAt', pageOptionsDto.order)
  //     .skip(pageOptionsDto.skip)
  //     .take(pageOptionsDto.take)
  //     .where({ status: StatusType.PENDING, isRented: false });

  //   const itemCount = await queryBuilder.getCount();
  //   const { entities } = await queryBuilder.getRawAndEntities();

  //   const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  //   return new PageDto(entities, pageMetaDto);
  // }

  // /**
  //  * Get rented billboard list
  //  */
  // async getRentedBillboards(
  //   pageOptionsDto: PageOptionsDto,
  // ): Promise<PageDto<BillboardInfoDto>> {
  //   const queryBuilder =
  //     this.billboardRepository.createQueryBuilder('billboards');

  //   queryBuilder
  //     .orderBy('billboards.createdAt', pageOptionsDto.order)
  //     .skip(pageOptionsDto.skip)
  //     .take(pageOptionsDto.take)
  //     .where({ status: StatusType.APPROVED, isRented: true });

  //   const itemCount = await queryBuilder.getCount();
  //   const { entities } = await queryBuilder.getRawAndEntities();

  //   const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  //   return new PageDto(entities, pageMetaDto);
  // }

  /**
   * Update a billboard
   */
  async update(
    id: string,
    body: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    const billboardToUpdate = await this.billboardRepository.findOne({
      where: { id: id, status: StatusType.DRAFT },
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
    const updatedBillboard = await this.findOneWithRelations(id);
    return updatedBillboard.toDto();
  }
}
