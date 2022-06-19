import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwtAuth.guard';
import { Repository } from 'typeorm';
import { UserDto } from './dto/UserDto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  @Inject(UsersService)
  private readonly usersService: UsersService;
  private readonly usersRepository: Repository<UserEntity>;

  @Get('id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'A user has been successfully fetched',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist.',
  })
  // getUserById(@Param() { id }: FindOneParams) {
  //   return this.usersService.getUserById(Number(id));
  // }
  public getOne(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.getUserById(id);
  }

  @Get('all')
  billBoardGet(): Promise<any> {
    return this.usersRepository.find();
  }

  @Post('create')
  @HttpCode(201)
  public createUser(@Body() body: UserDto): Promise<UserEntity> {
    return this.usersService.createUser(body);
  }

  @Patch('/delete/:id')
  @HttpCode(200)
  billBoardDelete(@Param('id') deleteId: string): Promise<any> {
    return this.usersService.deleteUser(deleteId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/token')
  GetOneBytoken(@Req() req){
    const userId = req.user.userId;
    return this.usersService.findOneByToken(userId);
  }

  // @Get('/getAll')
  // billBoardGet(): Promise<any> {
  //   return this.billboardsService.getAll();
  // }
}
