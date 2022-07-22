import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from 'src/modules/api/users/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { GetOneUserUseCase } from './GetOneUser.useCase';

@Controller('api/users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GetOneUserController {
  constructor(private readonly useCase: GetOneUserUseCase) {} // public readonly useCase: GetAllUserUseCase

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get 1 user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'A user has been successfully fetched',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist.',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(RoleType.ADMIN)
  async getOne(@Param('id') id: string): Promise<User> {
    return await this.useCase.execute(id);
  }
}
