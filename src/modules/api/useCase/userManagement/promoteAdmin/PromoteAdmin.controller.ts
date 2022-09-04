import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/api/users/user.entity';
import { PromoteAdminUseCase } from '.';

@Controller('api/admin/promote')
@ApiTags('Admin')
export class PromoteAdminController {
  constructor(private readonly useCase: PromoteAdminUseCase) {} // public readonly useCase: GetAllUserUseCase

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
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist.',
  })
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string, @Body() pw: string): Promise<User> {
    return await this.useCase.execute(id, pw);
  }
}
