import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { PlanInfoDto } from './dto/plan-info.dto';
import { Plan } from './plans.entity';
import { PlansService } from './plans.service';

@Controller('api/plans')
@ApiTags('Plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) { }

    /**
     * Create a plan
     * by Admin
     */
    @Post('create')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({
        summary: 'Admin Create a plan',
    })
    async createPlans(
        @Body() planDto: PlanInfoDto
        ): Promise<Plan> {
        return this.plansService.create(planDto);
    }

    /**
     * Get all plans
     * by Admin
     */
    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({
        summary: 'Admin Get all plans',
    })
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query() pageOptionsDto: PageOptionsDto,
    ): Promise<PageDto<Plan>> {
        return this.plansService.getAll(pageOptionsDto);
    }

   /**
     * Update a plan
     * by Admin
     */
    @Patch('update/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin Update a plan info' })
    async update(
      @Param('id') id: string,
      @Body() body: PlanInfoDto,
    ): Promise<Plan> {
      return await this.plansService.update(id, body);
    }
    
    /**
     * Get one plan
     * Any
     */
    @Get(':id')
    @ApiOperation({
        summary: 'Get one  plan info',
    })
    async GetOne(
        @Param('id') planId: string,
    ): Promise<Plan>{
        return await this.plansService.getOne(planId)
    }

}