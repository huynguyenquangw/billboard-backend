import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardInfoDto } from 'src/modules/api/billboards/dto/billboard-info.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GetAllBillboardsUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepository: Repository<Billboard>,
  ) {}

  /**
   * Get all billboard exclude deleted
   */
  async executeAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this._billboardRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('billboards.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .leftJoinAndSelect('billboards.ward', 'wards')
      .leftJoinAndSelect('wards.district', 'districts')
      .leftJoinAndSelect('districts.city', 'cities')
      .leftJoinAndSelect('billboards.owner', 'users')
      .addSelect('billboards.deletedAt')
      .withDeleted();

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Get all billboard exclude deleted
   */
  async execute(
    isActive: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this._billboardRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('billboards.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .leftJoinAndSelect('billboards.ward', 'wards')
      .leftJoinAndSelect('wards.district', 'districts')
      .leftJoinAndSelect('districts.city', 'cities')
      .leftJoinAndSelect('billboards.owner', 'users');

    switch (isActive) {
      case 'active':
        break;
      case 'inactive':
        queryBuilder
          .withDeleted()
          .addSelect('billboards.deletedAt')
          .where('billboards.deletedAt IS NOT NULL');
        break;
      default:
        break;
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
