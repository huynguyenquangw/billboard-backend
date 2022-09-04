import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/interceptors/TransformInterceptor.service';
import { User } from 'src/modules/api/users/user.entity';
import { PromoteAdminUseCase } from '.';

@Controller('api/admin/promote')
@ApiTags('Admin')
export class PromoteAdminController {
  constructor(private readonly useCase: PromoteAdminUseCase) {} // public readonly useCase: GetAllUserUseCase

  @Post(':id')
  @ApiOperation({ summary: 'Promote a user to admin' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Promoted',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist.',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async getOne(@Param('id') id: string, @Body() pw: string): Promise<any> {
    const result = await this.useCase.execute(id, pw);

    return { message: 'Promote successfully', result };
  }
}
