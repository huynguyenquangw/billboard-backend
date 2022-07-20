import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { PublishBillboardUseCase } from './PublishBillboard.useCase';

@Controller('api/users/me/billboards')
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
export class PublishBillboardController {
  constructor(private readonly useCase: PublishBillboardUseCase) {}

  /**
   * CURRENT USER - OWNER
   * Publish billboard
   * @returns draft billboard list with pagination
   */
  @Get(':id/publish')
  @ApiOperation({
    summary: 'Get all draft billboards of current user with pagination',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async publish(@Req() req, @Param('id') id: string): Promise<any> {
    return this.useCase.execute(req.user.id, id);
  }
}
