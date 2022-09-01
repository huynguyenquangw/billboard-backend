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
import { SearchUserByNameUseCase } from './SearchByName.useCase';

@Controller('api/admin/users')
@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SearchUserByNameController {
  constructor(private readonly useCase: SearchUserByNameUseCase) { }

  /**
   * ROLE: ADMIN
   * Get all users by name
   */
  @Get('search/name')
  @ApiOperation({ summary: 'Search all users by name' })
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
    @Query('name') name: string,
    @Query() pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserInfoDto>> {
    return await this.useCase.searchByName(pageOptionsDto, name);
  }

  /**
   * ROLE: ADMIN
   * Get all deleted users by name
   */
  @Get('search/deleted/name')
  @ApiOperation({ summary: 'Search all deleted users by name' })
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
  async getAllDeletedUsers(
    @Query('name') name: string,
    @Query() pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserInfoDto>> {
    return await this.useCase.searchDeletedByName(pageOptionsDto, name);
  }
}