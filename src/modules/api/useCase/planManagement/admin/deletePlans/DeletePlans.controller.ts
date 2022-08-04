// import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiForbiddenResponse,
//   ApiNoContentResponse,
//   ApiNotFoundResponse,
//   ApiOperation,
//   ApiTags,
// } from '@nestjs/swagger';
// import { RoleType } from 'src/constants';
// import { Roles } from 'src/decorators/roles.decorator';
// import { RolesGuard } from 'src/guards/roles.guard';
// import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
// import { UpdateResult } from 'typeorm';
// import { DeletePlansUseCase } from './DeletePlans.useCase';

// @Controller('api/admin/plans')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @ApiBearerAuth()
// export class DeletePlansController {
//   constructor(private readonly useCase: DeletePlansUseCase) {}

//   @Patch('delete/:id')
//   @ApiTags('Admin')
//   @ApiBearerAuth()
//   @Roles(RoleType.ADMIN)
//   @ApiOperation({ summary: 'ADMIN: soft delete a plan' })
//   @ApiNoContentResponse({
//     status: 204,
//     description: 'Plan with given id has been successfully deleted',
//   })
//   @ApiForbiddenResponse({
//     status: 403,
//     description: 'Forbidden',
//   })
//   @ApiNotFoundResponse({
//     status: 404,
//     description: 'Plan with given id is not exist',
//   })
//   async deletePlans(
//     @Req() req,
//     @Param('id') planId: string,
//   ): Promise<UpdateResult | void> {
//     return await this.useCase.delete(req.user.id, planId);
//   }
// }
