import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { StatusType } from 'src/constants';
import { Brackets, Repository, UpdateResult } from 'typeorm';
import { AddressService } from '../address/address.service';
import { District } from '../address/district.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Billboard } from './billboard.entity';
import { BillboardInfoDto } from './dto/billboard-info.dto';
import { CreateBillboardDto } from './dto/create-billboard.dto';

@Injectable()
export class BillboardsService {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepo: Repository<Billboard>,
    @InjectRepository(District)
    private readonly _districtRepo: Repository<District>,
    private readonly addressService: AddressService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Find only ONE billboard
   * by id
   */
  async findOne(id: string): Promise<Billboard> {
    const billboard: Billboard = await this._billboardRepo.findOne({
      where: { id: id },
    });
    if (billboard) {
      return billboard;
    }
    throw new NotFoundException(id);
  }

  /**
   * Find only ONE billboard
   * with relations
   * by id
   */
  async findOneWithRelations(id: string): Promise<Billboard> {
    return await this._billboardRepo.findOne({
      where: { id: id },
      relations: ['ward', 'ward.district', 'ward.district.city', 'owner'],
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

    const newBillboard: Billboard = await this._billboardRepo.create({
      ...createBillboardDto,
      owner: owner,
      ward: ward,
    });

    await this._billboardRepo.save(newBillboard);
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
    const searchBillboard = await this._billboardRepo.findAndCount({
      order: {
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

    const itemCount = searchBillboard[1];
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(searchBillboard[0], pageMetaDto);
  }

  /**
   * Update a billboard
   */
  async update(
    id: string,
    body: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    const billboardToUpdate = await this._billboardRepo.findOne({
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

    await this._billboardRepo.update(id, fullUpdateData);
    const updatedBillboard = await this.findOneWithRelations(id);
    return updatedBillboard.toDto();
  }

  /**
   * delete a billboard
   */
  async delete(
    ownerId: string,
    billboardId: string,
  ): Promise<UpdateResult | void> {
    const billboardToDelete = await this._billboardRepo.findOne({
      where: { id: billboardId, status: StatusType.DRAFT },
      relations: ['owner'],
    });

    // Check owner
    if (billboardToDelete.owner.id !== ownerId) {
      throw new ForbiddenException('Cannot delete this billboard');
    }

    const deleteResponse = await this._billboardRepo.softDelete(billboardId);
    if (!deleteResponse.affected) {
      throw new NotFoundException('Draft billboard with given id is not exist');
    }
    return deleteResponse;
  }

  /**
   * Get approved billboard list within district
   */
  async getCountOfBillboardsWithinDistrict(cityName: string): Promise<any> {
    const defaultCity = 'Ho Chi Minh City';
    const city = cityName || defaultCity;
    console.log(city);

    const queryBuilder = this._districtRepo.createQueryBuilder('districts');

    queryBuilder
      .leftJoin('districts.wards', 'wards')
      .leftJoin('wards.billboards', 'billboards')
      .leftJoin('districts.city', 'cities')
      .where('cities.name = :name', { name: city })
      // .orWhere(
      //   new Brackets((qb) => {
      //     qb.where('billboards.status = :status', {
      //       status: StatusType.APPROVED,
      //     }).andWhere('billboards.isRented = :isRented', { isRented: false });
      //   }),
      // )
      .orWhere(
        new Brackets((qb) => {
          qb.where('cities.name = :name', { name: city }).andWhere(
            'billboards.status = :status',
            {
              status: StatusType.APPROVED,
            },
          );
        }),
      )
      .select('districts.id', 'id')
      .addSelect('districts.name', 'name')
      .addSelect('districts.abbreviation', 'abbreviation')
      .addSelect('districts.photoUrl', 'photoUrl')
      .addSelect('COUNT(DISTINCT(billboards.id)) as billboard_count')
      .groupBy('districts.id');

    const result = await queryBuilder.getRawMany();

    return result;
  }
}
