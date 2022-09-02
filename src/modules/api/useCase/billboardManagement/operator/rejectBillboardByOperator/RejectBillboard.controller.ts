import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { RejectBillboardUseCase } from './RejectBillboard.useCase';

@Controller('api/operator/billboards')
@ApiTags('Operator')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RejectBillboardController {
  constructor(private readonly useCase: RejectBillboardUseCase) {}

  /**
   * Reject billboard
   */
  @Patch(':id/reject')
  @Roles(RoleType.OPERATOR, RoleType.ADMIN)
  @ApiOperation({ summary: 'OPERATOR: reeject 1 billboard' })
  async reject(@Param('id') id: string): Promise<any> {
    return this.useCase.execute(id);
  }
}
