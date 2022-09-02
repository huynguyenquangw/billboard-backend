import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { GetAllPendingBillboardsUseCase } from './GetAllPendingBillboards.useCase';

@Controller('api/operator/billboards')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Operator')
export class GetAllPendingBillboardsController {
  constructor(private readonly useCase: GetAllPendingBillboardsUseCase) {}

  /**
   * ROLE: OPERATOR
   * Get all PENDING billboards
   * with relations
   * @returns all billboards
   */
  @Get('pending')
  @ApiBearerAuth()
  @Roles(RoleType.OPERATOR, RoleType.ADMIN)
  @ApiOperation({
    summary: 'Get all billboards of current user by status',
  })
  @HttpCode(HttpStatus.OK)
  async getAllPending(
    @Query() pageOptionsDto: BillboardsPageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.useCase.execute(pageOptionsDto);
  }
}
