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
import { RoleType, StatusType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { BillboardInfoDto } from 'src/modules/api/billboards/dto/billboard-info.dto';
import { BillboardsPageOptionsDto } from 'src/modules/api/infra/dtos/BillboardsPageOptions.dto.ts/BillboardsPageOptions.dto';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { FilterByStatusUseCase } from './FilterByStatus.useCase';

@Controller('api/admin/billboards')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Admin')
export class FilterByStatusController {
    constructor(private readonly useCase: FilterByStatusUseCase) { }

    /**
     * ROLE: ADMIN
     * filter all billboards by status
     */
    @Get('search/status/:status')
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({
        summary: 'Filter all billboards by status',
    })
    @HttpCode(HttpStatus.OK)
    async filterStatus(
        @Param('status') status: StatusType,
        @Query() pageOptionsDto: BillboardsPageOptionsDto,
    ): Promise<PageDto<BillboardInfoDto>> {
        return this.useCase.filterStatus(pageOptionsDto, status);
    }
}  