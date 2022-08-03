import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardInfoDto } from 'src/modules/api/billboards/dto/billboard-info.dto';
import { BillboardsPageOptionsDto } from 'src/modules/api/infra/dtos/BillboardsPageOptions.dto.ts/BillboardsPageOptions.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GetAllPendingBillboardsUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepository: Repository<Billboard>,
  ) {}

  /**
   * Get all billboard include deleted
   */
  async execute(
    pageOptionsDto: BillboardsPageOptionsDto,
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
      .where('billboards.status = :status', { status: StatusType.PENDING });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
