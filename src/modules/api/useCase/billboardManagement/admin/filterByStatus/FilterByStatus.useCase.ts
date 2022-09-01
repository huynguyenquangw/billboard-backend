import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardInfoDto } from 'src/modules/api/billboards/dto/billboard-info.dto';
import { BillboardsPageOptionsDto } from 'src/modules/api/infra/dtos/BillboardsPageOptions.dto.ts/BillboardsPageOptions.dto';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class FilterByStatusUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepository: Repository<Billboard>,
  ) {}

  /**
   * filter all billboard by status
   */
  async filterStatus(
    pageOptionsDto: BillboardsPageOptionsDto,
    selectedStatus: StatusType,
  ): Promise<PageDto<BillboardInfoDto>> {
    const searchBillboard = await this._billboardRepository.findAndCount({
        order: {
          createdAt: pageOptionsDto.order,
        },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        relations: ['ward', 'ward.district', 'ward.district.city', 'owner'],
        where: {
            status: selectedStatus,
        },
      });
  
      const itemCount = searchBillboard[1];
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  
      return new PageDto(searchBillboard[0], pageMetaDto);
  }
}