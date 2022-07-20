import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { StatusType } from 'src/constants';
import { BillboardInfoDto } from 'src/modules/api/billboards/dto/billboard-info.dto';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { GetAllBillboardsByStatusUseCase } from './GetAllBillboardsByStatus.useCase';

@Controller('api/users/me/billboards')
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
export class GetAllBillboardsByStatusController {
  constructor(private readonly useCase: GetAllBillboardsByStatusUseCase) {}

  /**
   * TODO: update check current user
   * TODO: move it to useCase folder (billboardManagement) later on
   * CURRENT USER - OWNER
   * Get draft billboard list by created time (default)
   * @returns draft billboard list with pagination
   */
  @Get(':status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all billboards of current user by status',
  })
  @HttpCode(HttpStatus.OK)
  async getAllByStatus(
    @Req() req,
    @Param('status') status: StatusType,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.useCase.execute(req.user.id, status, pageOptionsDto);
  }
}
