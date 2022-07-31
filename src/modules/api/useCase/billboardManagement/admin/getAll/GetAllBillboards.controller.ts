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
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { BillboardInfoDto } from 'src/modules/api/billboards/dto/billboard-info.dto';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { GetAllBillboardsUseCase } from './GetAllBillboards.useCase';

@Controller('api/admin/billboards')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Admin')
export class GetAllBillboardsController {
  constructor(private readonly useCase: GetAllBillboardsUseCase) {}

  /**
   * ROLE: ADMIN
   * Get all billboards
   * include deleted
   * with relations
   * @returns all billboards
   */
  @Get('all')
  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Get all billboards of current user by status',
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.useCase.executeAll(pageOptionsDto);
  }

  /**
   * ROLE: ADMIN
   * Get all billboards
   * with relations
   * @params active | inactive
   * @returns all billboards
   */
  @Get('all/:activeVal')
  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Get all billboards of current user by status',
  })
  @HttpCode(HttpStatus.OK)
  async getAllActive(
    @Param('activeVal') activeVal: string = 'inactive' || 'active',
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.useCase.execute(activeVal, pageOptionsDto);
  }
}
