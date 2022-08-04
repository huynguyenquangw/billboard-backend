import {
  Controller,
  ForbiddenException,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { DeleteAndRestoreUserUseCase } from './DeleteAndRestoreUser.useCase';

@Controller('api/admin/users')
@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DeleteAndRestoreUserController {
  constructor(private readonly useCase: DeleteAndRestoreUserUseCase) {}

  /**
   * Soft-delete user
   */
  @Patch(':id/delete')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'ADMIN: soft-delete' })
  @ApiNoContentResponse({
    status: 204,
    description: 'User with given id has been successfully deleted',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User with given id is not exist',
  })
  async delete(
    @Req() req,
    @Param('id') id: string,
  ): Promise<UpdateResult | void> {
    if (id === req.user.id) {
      throw new ForbiddenException('Cannot delete yourself');
    }
    return await this.useCase.delete(id);
  }

  /**
   * Restore a deleted user
   */
  @Patch(':id/restore')
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
    @Req() req,
    @Param('id') id: string,
  ): Promise<UpdateResult | void> {
    if (id == req.user.id) {
      throw new ForbiddenException('Cannot restore yourself');
    }
    return await this.useCase.restore(id);
  }
}
