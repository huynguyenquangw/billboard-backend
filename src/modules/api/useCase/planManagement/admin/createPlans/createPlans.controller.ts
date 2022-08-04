// import {
//   Body,
//   Controller,
//   HttpCode,
//   HttpStatus,
//   Post,
//   UseGuards,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { RoleType } from 'src/constants';
// import { Roles } from 'src/decorators/roles.decorator';
// import { RolesGuard } from 'src/guards/roles.guard';
// import { PlanDto } from 'src/modules/api/plans/dto/plan-info.dto';
// import { Plan } from 'src/modules/api/plans/plans.entity';
// import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
// import { CreatePlansUseCase } from './CreatePlans.useCase';

// @Controller('api/admin/plans')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @ApiTags('Admin')
// export class CreatePlansController {
//   constructor(private readonly useCase: CreatePlansUseCase) {}

//   @Post('create')
//   @ApiBearerAuth()
//   @Roles(RoleType.ADMIN)
//   @ApiOperation({
//     summary: 'Create a plan',
//   })
//   async createPlans(@Body() planDto: PlanDto): Promise<Plan> {
//     return this.useCase.create(planDto);
//   }
// }
