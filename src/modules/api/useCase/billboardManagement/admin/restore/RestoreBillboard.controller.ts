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
import { RestoreBillboardUseCase } from './RestoreBillboard.useCase';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RestoreBillboardController {
  constructor(private readonly useCase: RestoreBillboardUseCase) {}

  /**
   * Restore a deleted billboard
   */
  @Patch('api/admin/billboards/:id/restore')
  @ApiTags('Admin')
  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'ADMIN: restore a deleted user' })
  @ApiNoContentResponse({
    status: 204,
    description: 'User with given id has been successfully restored',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User with given id is active or not exist',
  })
  async restore(
    @Param('id') billboardId: string,
  ): Promise<UpdateResult | void> {
    return await this.useCase.restore(billboardId);
  }
}
