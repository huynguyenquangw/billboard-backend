import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Plan } from 'src/modules/api/plans/plans.entity';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { GetAllPlansUseCase } from './GetPlans.useCase';

@Controller('api/admin/plans')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Admin')
export class GetAllPlansController {
    constructor(private readonly useCase: GetAllPlansUseCase) { }

    @Get('all')
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({
        summary: 'Get all plans',
    })
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query() pageOptionsDto: PageOptionsDto,
    ): Promise<PageDto<Plan>> {
        return this.useCase.getAll(pageOptionsDto);
    }
}