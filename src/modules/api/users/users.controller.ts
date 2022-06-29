import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwtAuth.guard';
import { Repository } from 'typeorm';
import { UserInfoDto } from './dto/user-info.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  @Inject(UsersService)
  private readonly usersService: UsersService;
  private readonly usersRepository: Repository<UserEntity>;

  @Get()
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

  @Get('me')
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

  @Get('all')
  getAllUsers(): Promise<any> {
    return this.usersService.getAllUsers();
  }

  // @Post('create')
  // @HttpCode(201)
  // createUser(@Body() body: UserInfoDto): Promise<UserEntity> {
  //   return this.usersService.createUser(body);
  // }

  // @Patch('/delete/:id')
  // @HttpCode(200)
  // billBoardDelete(@Param('id') deleteId: string): Promise<any> {
  //   return this.usersService.deleteUser(deleteId);
  // }

  // @UseGuards(JwtAuthGuard) //Check if the request, which is an accessToken, is actually a real accessToken follow the JWT rules.
  // @Get('/token')
  // GetOneBytoken(@Req() req) {
  //   const userId = req.user.userId;
  //   return this.usersService.findOneByToken(userId);
  // }

  // @Get('/getAll')
  // billBoardGet(): Promise<any> {
  //   return this.billboardsService.getAll();
  // }
}
