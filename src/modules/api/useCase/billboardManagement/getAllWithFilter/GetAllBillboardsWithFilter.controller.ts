import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { BillboardInfoDto } from 'src/modules/api/billboards/dto/billboard-info.dto';
import { GetAllBillboardsWithFilterUseCase } from './GetAllBillboardsWithFilter.useCase';

@Controller('api/billboards')
@ApiTags('Billboards')
export class GetAllBillboardsWithFilterController {
  constructor(private readonly useCase: GetAllBillboardsWithFilterUseCase) {}

  /**
   * Get billboard list (by created time as default)
   * @returns billboard list with pagination
   */
  @Get('all')
  @ApiOperation({
    summary: 'Get all billboards for main page',
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.useCase.execute(pageOptionsDto);
  }
}
