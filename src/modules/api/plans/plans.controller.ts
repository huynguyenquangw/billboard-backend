import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
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
import { Plan } from './entities/plans.entity';
import { PlansService } from './plans.service';
import { Subscription } from './entities/subscriptions.entity';

@Controller('api/plans')
@ApiTags('Plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) { }
    /**
     * TODO: Add TransformInterceptor
     */

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
   // @UseInterceptors(TransformInterceptor)
    async createPlans(
        @Body() planDto: PlanInfoDto
    ){
        const result = this.plansService.create(planDto)
        return { message: 'Create plan succesfully' , result};
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
    // @UseInterceptors(TransformInterceptor)
    async getAll(
        @Query() pageOptionsDto: PageOptionsDto,
    ): Promise<PageDto<Plan>> {
        return this.plansService.getAllPlan(pageOptionsDto);
    }

    /**
     * Get all published plans
     */
    @Get('all/published')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all published plans',
    })
    // @UseInterceptors(TransformInterceptor)
    async getAllPublished(
        @Query() pageOptionsDto: PageOptionsDto,
    ): Promise<PageDto<Plan>> {
        return this.plansService.getAllPublished(pageOptionsDto);
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
    // @UseInterceptors(TransformInterceptor)
    async update(
        @Param('id') id: string,
        @Body() body: PlanInfoDto,
    ): Promise<Plan> {
        return await this.plansService.update(id, body);
    }

    /**
     * Pay to create a subscription
     */
    @Post('pay')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Pay to create a subscription using stripe' })
    // @UseInterceptors(TransformInterceptor)
    async pay(
        @Req() req,
        @Body('planId') planId: string,
        @Body('amount') amount: number,
        @Body('id') id: string,
    ): Promise<any> {
        return await this.plansService.pay(req.user.id, planId, amount, id);
    }

    /**
     * Unsubscribe a subscription
     */
    @Patch('unsubscribe/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Unsubscribe a plan' })
    // @UseInterceptors(TransformInterceptor)
    async unSub(
        @Param('id') planId: string,
    ): Promise<Subscription>{
        return await this.plansService.unsubscribe(planId)
    }

    /**
     * Find the subcription of the user id
     */
     @Get('subscription/find')
     @UseGuards(JwtAuthGuard)
     @ApiBearerAuth()
     @ApiOperation({
         summary: 'Find the subscription by the user id',
     })
    // @UseInterceptors(TransformInterceptor)
     async checkSub(
         @Req() req, 
     ): Promise<Subscription> {
         return this.plansService.checkSubByUser(req.user.id);
     }

    /**
     * Get one subcription by id
     */
     @Get('subscription/:id')
     @UseGuards(JwtAuthGuard)
     @ApiBearerAuth()
     @ApiOperation({
         summary: 'Get one subscriptions by id',
     })
    // @UseInterceptors(TransformInterceptor)
     async GetOneSub(
         @Param('id') subId :string, 
     ): Promise<Subscription> {
         return this.plansService.getOneSub(subId);
     }

    /**
     * Get one plan
     * Any
     */
    @Get(':id')
    @ApiOperation({
        summary: 'Get one  plan info',
    })
    // @UseInterceptors(TransformInterceptor)
    async GetOnePlan(
        @Param('id') planId: string,
    ): Promise<Plan> {
        return await this.plansService.getOnePlan(planId)
    }

}