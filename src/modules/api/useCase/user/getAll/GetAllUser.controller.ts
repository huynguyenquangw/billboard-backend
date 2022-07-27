import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from 'src/modules/api/users/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { GetAllUserUseCase } from './GetAllUser.useCase';

@Controller('api/admin/users/all')
@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GetAllUserController {
  constructor(private readonly useCase: GetAllUserUseCase) {} // public readonly useCase: GetAllUserUseCase

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
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.useCase.execute(pageOptionsDto);
  }
}
