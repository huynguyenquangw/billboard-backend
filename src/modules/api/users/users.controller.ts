import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwtAuth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserInfoDto>> {
    return this.usersService.getUsers(pageOptionsDto);
  }

  @Get('me')
  @ApiOperation({ summary: "Get current user's profile" })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserInfoDto,
    description: "Get current user's info",
  })
  @ApiUnauthorizedResponse({
    // type: UserInfoDto,
    // description: "Get current user's info",
  })
  getMe(@Req() req): Promise<UserInfoDto> {
    return this.usersService.getUserById(req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(): Promise<UserInfoDto[]> {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
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
    type: UserInfoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist.',
  })
  async getUserById(@Param('id') id: string): Promise<UserInfoDto> {
    const user: User = await this.usersService.getUserById(id);
    return user.toDto();
  }

  /**
   * USER
   * Update user
   */
  @Patch(':id/update')
  @ApiOperation({ summary: 'Update user info' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserInfoDto> {
    return await this.usersService.updateUser(id, body);
  }

  /**
   * ADMIN
   * Soft-delete user
   */
  @Patch(':id/delete')
  @ApiOperation({ summary: 'ADMIN: soft-delete' })
  @HttpCode(200)
  async billBoardDelete(@Param('id') deleteId: string): Promise<void> {
    return await this.usersService.deleteUser(deleteId);
  }
}
