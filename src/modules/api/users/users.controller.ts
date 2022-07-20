import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UsersService } from './users.service';

@Controller('api/users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  /**
   * Get current user's profile
   */
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's profile" })
  @ApiOkResponse({
    status: 200,
    description: "Return current user's information",
    type: UserInfoDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized or Unauthenticated',
  })
  @ApiUnauthorizedResponse({
    status: 404,
    description: 'User does not exist.',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req): Promise<UserInfoDto> {
    return this.usersService.getOneWithAddress(req.user.userId);
  }

  /**
   * Update current user's info
   */
  @Patch('me/update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user info' })
  @ApiOkResponse({
    status: 200,
    description: 'User information is successfully updated',
    type: UserInfoDto,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized or Unauthenticated',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User does not exist',
  })
  async updateMe(
    @Req() req,
    @Body() body: UpdateUserDto,
  ): Promise<UserInfoDto> {
    return await this.usersService.updateUser(req.user.userId, body);
  }
}
