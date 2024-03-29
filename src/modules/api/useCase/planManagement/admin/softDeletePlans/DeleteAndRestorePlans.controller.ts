import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { UpdateResult } from 'typeorm';
import { DeleteAndRestorePlansUseCase } from './DeleteAndRestorePlans.useCase';

@Controller('api/admin/plans')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DeleteAndRestorePlansController {
  constructor(private readonly useCase: DeleteAndRestorePlansUseCase) {}

  /**
   * Soft Delete aPlan
   * by Admin
   */
  @Patch('delete/:id')
  @ApiTags('Admin')
  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'ADMIN: soft delete a plan' })
  @ApiNoContentResponse({
    status: 204,
    description: 'Plan with given id has been successfully deleted',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Plan with given id does not exist',
  })
  async deletePlans(
    @Req() req,
    @Param('id') planId: string,
  ): Promise<UpdateResult | void> {
    return await this.useCase.delete(req.user.id, planId);
  }

  /**
   * Restore a deleted plan
   * by Admin
   */
  @Patch('restore/:id')
  @ApiTags('Admin')
  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'ADMIN: restore a deleted plan' })
  @ApiNoContentResponse({
    status: 204,
    description: 'The plan with given id has been successfully restored',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'The plan with given id is active or not exist',
  })
  async restore(@Param('id') planId: string): Promise<UpdateResult | void> {
    return await this.useCase.restore(planId);
  }
}
