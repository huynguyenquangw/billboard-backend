import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { LoggedInUserRoleCheckUseCase } from './LoggedInUserRoleCheck.useCase';

@Controller('api/users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LoggedInUserRoleCheckController {
  constructor(private readonly useCase: LoggedInUserRoleCheckUseCase) {} // public readonly useCase: GetAllUserUseCase

  @Get('check-role')
  @Roles(RoleType.ADMIN, RoleType.OPERATOR, RoleType.USER)
  @HttpCode(HttpStatus.OK)
  async checkRole(@Req() req): Promise<string> {
    return await this.useCase.execute(req.user.id);
  }
}
