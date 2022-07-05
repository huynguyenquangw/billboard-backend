import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
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
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwtAuth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UsersService } from './users.service';

@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  @Inject(UsersService)
  private readonly usersService: UsersService;

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
  getUserById(@Param('id') id: string): Promise<UserInfoDto> {
    return this.usersService.getUserById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers(): Promise<UserInfoDto[]> {
    return this.usersService.getAllUsers();
  }

  /**
   * USER
   * Update user
   */
  @Patch(':id/update')
  @ApiOperation({ summary: 'Update user info' })
  update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserInfoDto> {
    return this.usersService.updateUser(id, body);
  }

  /**
   * ADMIN
   * Soft-delete user
   */
  @Patch(':id/delete')
  @ApiOperation({ summary: 'ADMIN: soft-delete' })
  @HttpCode(200)
  billBoardDelete(@Param('id') deleteId: string): Promise<void> {
    return this.usersService.deleteUser(deleteId);
  }
}
