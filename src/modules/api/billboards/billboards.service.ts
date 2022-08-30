import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { isStringArrayEqual } from 'src/common/helper/isStringArrayEqual.helper';
import { RoleType, StatusType, UserType } from 'src/constants';
import { ActionType } from 'src/constants/action-type';
import { S3Service } from 'src/shared/services/aws-s3.service';
import { In, Repository, UpdateResult } from 'typeorm';
import { AddressService } from '../address/address.service';
import { District } from '../address/district.entity';
import { PlansService } from '../plans/plans.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Billboard } from './billboard.entity';
import { BillboardInfoDto } from './dto/billboard-info.dto';
import { CreateBillboardDto } from './dto/create-billboard.dto';
import { UpdateBillboardDto } from './dto/update-billboard.dto';
import { Picture } from './entities/picture.entity';
import { PreviousClient } from './previousClients.entity';

@Injectable()
export class BillboardsService {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepo: Repository<Billboard>,
    @InjectRepository(PreviousClient)
    private readonly _previousClientRepo: Repository<PreviousClient>,
    @InjectRepository(District)
    private readonly _districtRepo: Repository<District>,
    @InjectRepository(Picture)
    private readonly _pictureRepo: Repository<Picture>,
    private readonly _addressService: AddressService,
    private readonly _usersService: UsersService,
    private readonly _s3Service: S3Service,
    private readonly _planService: PlansService,
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
    body: CreateBillboardDto,
    ownerId: string,
    // files?: Array<Express.Multer.File>,
  ): Promise<Billboard> {
    const preClientIds = body.previousClientIds ? body.previousClientIds : [];
    const owner: User = await this._usersService.findOne(ownerId);
    const ward = await this._addressService.getOneWard(body.wardId);

    if (!owner) {
      throw new NotFoundException('User not found');
    }
    if (!ward) {
      throw new NotFoundException('Address not found');
    }
    if (owner?.userType === UserType.FREE) {
      throw new ForbiddenException(
        'Need to subcribe before creating a new billboard',
      );
    }

    let preClients: PreviousClient[] = [];
    preClients = await this._previousClientRepo.find({
      where: { id: In(preClientIds) },
    });

    const newBillboard: Billboard = await this._billboardRepo.create({
      ...body,
      owner: owner,
      ward: ward,
      previousClients: preClients,
    });

    await this._billboardRepo.save(newBillboard);

    return newBillboard;
  }

  /**
   * Update a billboard
   */
  async update(
    id: string,
    body: UpdateBillboardDto,
  ): Promise<BillboardInfoDto> {
    const billboardToUpdate = await this._billboardRepo.findOne({
      where: { id: id, status: StatusType.DRAFT || StatusType.REJECTED },
      relations: ['ward'],
    });

    if (!billboardToUpdate) {
      throw new NotFoundException('Billboard with given id does not exist!');
    }

    const preClientIds = body.previousClientIds ? body.previousClientIds : [];

    const { previousClientIds, wardId, ...info } = body;
    let updateBody = { ...info };

    // check pre Clients
    let preClients: PreviousClient[] = billboardToUpdate.previousClients;
    const currentPreClientIds = billboardToUpdate.previousClients.map(
      (a) => a.id,
    );
    if (
      body.previousClientIds &&
      !isStringArrayEqual(body.previousClientIds, currentPreClientIds)
    ) {
      preClients = await this._previousClientRepo.find({
        where: { id: In(preClientIds) },
      });
      const updateBodyWithClients = {
        ...updateBody,
        previousClients: preClients,
      };
      updateBody = updateBodyWithClients;
    }

    // check ward
    if (
      body.wardId &&
      billboardToUpdate.ward.id &&
      body.wardId != billboardToUpdate.ward.id
    ) {
      const ward = await this._addressService.getOneWard(body.wardId);
      const updateBodyWithWard = {
        ...updateBody,
        ward: ward,
      };
      updateBody = { ...updateBodyWithWard };
    }

    await this._billboardRepo.update(id, {
      ...updateBody,
    });

    const updatedBillboard = await this.findOneWithRelations(id);
    return updatedBillboard.toDto();
  }

  /**
   * delete a billboard
   */
  async delete(
    currentUserId: string,
    billboardId: string,
  ): Promise<UpdateResult | void> {
    const billboardToDelete = await this._billboardRepo.findOne({
      where: {
        id: billboardId,
      },
      relations: ['owner'],
    });
    if (!billboardToDelete) {
      throw new NotFoundException('Billboard with given id does not exist!');
    }

    const currentUser = await this._usersService.findOne(currentUserId);
    if (!currentUser) {
      throw new NotFoundException('User with token does not exist!');
    }

    if (
      currentUser.role !== RoleType.ADMIN &&
      (billboardToDelete.owner.id !== currentUserId ||
        billboardToDelete.status !== StatusType.DRAFT)
    ) {
      throw new ForbiddenException('Cannot delete this billboard');
    }

    // DELETE billboard
    billboardToDelete.status = StatusType.DELETED;
    await this._billboardRepo.save(billboardToDelete);
    console.log(billboardToDelete);
    const deleteResponse = await this._billboardRepo.softDelete(billboardId);

    if (!deleteResponse.affected) {
      throw new NotFoundException('Billboard with given id does not exist!');
    }

    return deleteResponse;
  }

  //Search and get all billboard by address2, rentalPrice, size_x, size_y, district(not done)
  async search(
    pageOptionsDto: PageOptionsDto,
    selectedAdrress2: string,
    selectedPrice: number,
    selectedSize_x: number,
    selectedSize_y: number,
    selectedDistrict: string,
    selectedName: string,
  ): Promise<PageDto<BillboardInfoDto>> {
    const searchBillboard = await this._billboardRepo.findAndCount({
      order: {
        createdAt: pageOptionsDto.order,
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      relations: ['ward', 'ward.district', 'ward.district.city', 'owner'],
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
        name: selectedName,
      },
    });

    const itemCount = searchBillboard[1];
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(searchBillboard[0], pageMetaDto);
  }

  /**
   */
  async getCountOfBillboardsWithinDistrict(cityName: string): Promise<any> {
    const defaultCity = 'Ho Chi Minh City';
    const city = cityName || defaultCity;

    const queryBuilder = this._districtRepo.createQueryBuilder('districts');

    queryBuilder
      .leftJoin('districts.wards', 'wards')
      .leftJoin('wards.billboards', 'billboards')
      .leftJoin('districts.city', 'cities')
      .leftJoin('billboards.owner', 'users')
      // .orWhere(
      //   new Brackets((qb) => {
      //     qb.where('billboards.status = :status', {
      //       status: StatusType.APPROVED,
      //     }).andWhere('billboards.isRented = :isRented', { isRented: false });
      //   }),
      // )
      // .orWhere(
      //   new Brackets((qb) => {
      //     qb.where('cities.name = :name', { name: city }).andWhere(
      //       'billboards.status = :status',
      //       {
      //         status: StatusType.APPROVED,
      //       },
      //     );
      //   }),
      // )
      .where('cities.name = :name', { name: city })
      .andWhere('users.userType = :subcribedUser', {
        subcribedUser: UserType.SUBSCRIBED,
      })
      .select('districts.id', 'id')
      .addSelect('districts.name', 'name')
      .addSelect('districts.abbreviation', 'abbreviation')
      .addSelect('districts.photoUrl', 'photoUrl')
      .addSelect(
        `COUNT(DISTINCT(billboards.id)) filter (where billboards.status = '${StatusType.APPROVED}' or billboards.status = '${StatusType.RENTED}') as billboard_count`,
      )
      .groupBy('districts.id');

    const result = await queryBuilder.getRawMany();

    return result;
  }

  /*
   *Get All PreviousClient
   */
  async getAllPreviousClient(): Promise<PreviousClient[]> {
    return await this._previousClientRepo.find();
  }

  /**
   * Publish a billboard
   */
  async publish(ownerId: string, billboardId: string): Promise<Billboard> {
    try {
      const selectedBillboard = await this.findOneWithRelations(billboardId);

      // check right owner
      if (selectedBillboard.owner.id !== ownerId) {
        throw new ForbiddenException('Forbidden');
      }
      if (selectedBillboard?.owner?.userType === UserType.FREE) {
        throw new ForbiddenException(
          'Need to subcribe before request for approval',
        );
      }

      // check current status - DRAFT
      if (selectedBillboard.status !== StatusType.DRAFT) {
        throw new Error('Cannot publish this billboard');
      }

      // Check subscription
      const sub = await this._planService.checkSubByUser(ownerId);
      if (!sub) {
        throw new NotFoundException('Subscription not found');
      }
      if (sub.remainingPost < 1) {
        throw new ForbiddenException(
          'You have reach the maximum amount of your posts',
        );
      }

      await this._planService.handleRemainingPost(sub, ActionType.DEC);
      selectedBillboard.status = StatusType.PENDING;
      return this._billboardRepo.save(selectedBillboard);
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Add billboard's pictures
   */
  async addPictures(
    billboardId: string,
    uploadPictures: Array<Express.Multer.File>,
  ) {
    const billboardToAddPictures = await this._billboardRepo.findOne({
      where: { id: billboardId, status: StatusType.DRAFT },
    });

    if (!billboardToAddPictures) {
      throw new NotFoundException('Billboard with given id does not exist!');
    }

    if (!uploadPictures) {
      throw new BadRequestException(
        'Uploading list is empty. A billboard must has at least 5 pictures',
      );
    }

    const isBillboardFilesUpdated =
      await this._s3Service.isBillboardFilesUpdated(
        billboardToAddPictures,
        uploadPictures,
      );

    if (!isBillboardFilesUpdated) {
      throw new Error('Upload failed!');
    }
    return { uploaded_billboard_id: billboardId };
  }

  /*
   *Get One PreviousClient
   */
  async getOnePreviousClient(getOneId: string): Promise<PreviousClient> {
    return await this._previousClientRepo.findOne({
      where: {
        id: getOneId,
      },
    });
  }
}
