import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('api/users')
@ApiTags('users')
export class UserController {
  @Inject(UserService)
  private readonly usersService: UserService;

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  // @ApiResponse({
  //   status: 200,
  //   description: 'A user has been successfully fetched',
  //   type: UserEntity,
  // })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist.',
  })
  // getUserById(@Param() { id }: FindOneParams) {
  //   return this.usersService.getUserById(Number(id));
  // }
  public getUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.usersService.getUserById(id);
  }

  @Post()
  public createUser(@Body() body: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(body);
  }
}
