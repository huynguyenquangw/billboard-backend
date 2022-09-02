import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { BillboardInfoDto } from 'src/modules/api/billboards/dto/billboard-info.dto';
import { BillboardsPageOptionsDto } from 'src/modules/api/infra/dtos/BillboardsPageOptions.dto.ts/BillboardsPageOptions.dto';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { SearchBillboardByNameUseCase } from './SearchByName.useCase';

@Controller('api/admin/billboards')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Admin')
export class SearchBillBoardByNameController {
  constructor(private readonly useCase: SearchBillboardByNameUseCase) { }

  /**
   * ROLE: ADMIN
   * search all billboards by name
   */
  @Get('search/name')
  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Get all billboards by name',
  })
  @HttpCode(HttpStatus.OK)
  async searchName(
    @Query('name') name: string,
    @Query() pageOptionsDto: BillboardsPageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.useCase.searchByName(pageOptionsDto, name);
  }

  /**
   * ROLE: ADMIN
   * search all deleted billboards by name
   */
  @Get('search/deleted/name')
  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Get all deleted billboards by name',
  })
  @HttpCode(HttpStatus.OK)
  async searchDeletedName(
    @Query('name') name: string,
    @Query() pageOptionsDto: BillboardsPageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.useCase.searchDeletedByName(pageOptionsDto, name);
  }
}