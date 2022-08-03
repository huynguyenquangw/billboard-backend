import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { ApproveBillboardUseCase } from './ApproveBillboard.useCase';

@Controller('api/operator/billboards')
@ApiTags('Operator')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApproveBillboardController {
  constructor(private readonly useCase: ApproveBillboardUseCase) {}

  /**
   * Approve billboard
   */
  @Patch(':id/approve')
  @Roles(RoleType.OPERATOR)
  @ApiOperation({ summary: 'OPERATOR: approve 1 billboard' })
  async approve(@Param('id') id: string): Promise<Billboard | any> {
    return this.useCase.execute(id);
  }
}
