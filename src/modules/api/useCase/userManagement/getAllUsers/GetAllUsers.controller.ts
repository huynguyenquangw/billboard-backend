import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersPageOptionsDto } from 'src/modules/api/infra/dtos/usersPageOptions.dto.ts/UsersPageOptions.dto';
import { UserInfoDto } from 'src/modules/api/users/dto/user-info.dto';
import { User } from 'src/modules/api/users/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { GetAllUsersUseCase } from './GetAllUsers.useCase';

@Controller('api/admin/users/all')
@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GetAllUsersController {
  constructor(private readonly useCase: GetAllUsersUseCase) {} // public readonly useCase: GetAllUserUseCase

  /**
   * ROLE: ADMIN
   * Get all users
   * include deleted
   * with relations
   * @returns all users
   */
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
  async getAllUsers(
    @Query() pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserInfoDto>> {
    return await this.useCase.executeAll(pageOptionsDto);
  }

  /**
   * ROLE: ADMIN
   * Get all users
   * with relations
   * @params active || inactive
   * @returns all users
   */
  @Get(':activeVal')
  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Get all billboards of current user by status',
  })
  @HttpCode(HttpStatus.OK)
  async getAllActive(
    @Param('activeVal') activeVal: string = 'inactive' || 'active',
    @Query('searchName') name: string,
    @Query() pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserInfoDto>> {
    return this.useCase.execute(activeVal, name, pageOptionsDto);
  }
}
