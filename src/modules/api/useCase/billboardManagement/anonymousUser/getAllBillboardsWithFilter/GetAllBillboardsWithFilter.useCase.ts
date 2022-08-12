import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { BillboardFilterMode, StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardsService } from 'src/modules/api/billboards/billboards.service';
import { BillboardInfoDto } from 'src/modules/api/billboards/dto/billboard-info.dto';
import { SearchBillboardsPageOptionsDto } from 'src/modules/api/infra/dtos/BillboardsPageOptions.dto.ts/SearchBillboardsPageOptions.dto';
import { Repository } from 'typeorm';

@Injectable()
// implements IUseCase<Request, Promise<Response>>
export class GetAllBillboardsWithFilterUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepository: Repository<Billboard>,
    private readonly _billboardsService: BillboardsService,
  ) {}

  /**
   * Get approved billboard list
   *
   */
  async execute(
    pageOptionsDto: SearchBillboardsPageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    const queryBuilder =
      this._billboardRepository.createQueryBuilder('billboards');
    queryBuilder
      .orderBy(`billboards.${pageOptionsDto.sortMode}`, pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .leftJoinAndSelect('billboards.ward', 'wards')
      .leftJoinAndSelect('wards.district', 'districts')
      .leftJoinAndSelect('districts.city', 'cities')
      .leftJoinAndSelect('billboards.owner', 'users');

    switch (pageOptionsDto.filterMode) {
      case BillboardFilterMode.APPROVED:
        queryBuilder.where({ status: StatusType.APPROVED });
        break;
      case BillboardFilterMode.RENTED:
        queryBuilder.where({ status: StatusType.RENTED });
        break;
      case BillboardFilterMode.DEFAULT:
        queryBuilder
          .where({ status: StatusType.APPROVED })
          .orWhere({ status: StatusType.RENTED });
        break;
      default:
        queryBuilder
          .where({ status: StatusType.APPROVED })
          .orWhere({ status: StatusType.RENTED });
        break;
    }

    if (pageOptionsDto.district) {
      queryBuilder.andWhere('districts.id = :districtId', {
        districtId: pageOptionsDto.district,
      });
    }

    if (pageOptionsDto.searchText) {
      queryBuilder
        .andWhere('billboards.address like :searchText', {
          searchText: `%${pageOptionsDto.searchText}%`,
        })
        .orWhere('billboards.address2 like :searchText', {
          searchText: `%${pageOptionsDto.searchText}%`,
        });
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
