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
export class SearchBillboardByNameUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepository: Repository<Billboard>,
  ) {}

  /**
   * Get all billboard by name
   */
  async searchByName(
    pageOptionsDto: BillboardsPageOptionsDto,
    selectedName: string,
  ): Promise<PageDto<BillboardInfoDto>> {
    const searchBillboard = await this._billboardRepository.findAndCount({
        order: {
          createdAt: pageOptionsDto.order,
        },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        relations: ['ward', 'ward.district', 'ward.district.city', 'owner'],
        where: {
            name: ILike(`%${selectedName}%`),
        },
      });
  
      const itemCount = searchBillboard[1];
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  
      return new PageDto(searchBillboard[0], pageMetaDto);
  }

  /**
   * Get all deleted billboard by name
   */
   async searchDeletedByName(
    pageOptionsDto: BillboardsPageOptionsDto,
    selectedName: string,
  ): Promise<PageDto<BillboardInfoDto>> {
    console.log('name: ', selectedName)
    const searchBillboard = await this._billboardRepository.findAndCount({
        order: {
          createdAt: pageOptionsDto.order,
        },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        relations: ['ward', 'ward.district', 'ward.district.city', 'owner'],
        where: {
          name: ILike(`%${selectedName}%`),
          status: StatusType.DELETED,
        },
        withDeleted: true,
      });
  
      const itemCount = searchBillboard[1];
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  
      return new PageDto(searchBillboard[0], pageMetaDto);
  }
}
