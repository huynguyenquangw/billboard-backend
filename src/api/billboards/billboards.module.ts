import { Module } from '@nestjs/common';
import { BillboardController } from './billboards.controller';
import { BillboardService } from './billboards.service';

@Module({
  controllers: [BillboardController],
  providers: [BillboardService],
})
export class BillboardModule {}
