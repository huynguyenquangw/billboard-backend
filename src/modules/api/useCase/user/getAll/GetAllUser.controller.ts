import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from 'src/modules/api/users/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { GetAllUserUseCase } from './GetAllUser.useCase';

@Controller('api/users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GetAllUserController {
  constructor(private readonly useCase: GetAllUserUseCase) {} // public readonly useCase: GetAllUserUseCase

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users has been successfully fetched.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found!',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  async getAllUsers(): Promise<any> {
    // return await this.useCase.execute();
  }
}
