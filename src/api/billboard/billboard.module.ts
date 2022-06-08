import { Module } from '@nestjs/common';
import { BillboardController } from './billboard.controller';
import { BillboardService } from './billboard.service';

@Module({
  controllers: [BillboardController],
  providers: [BillboardService]
})
export class BillboardModule {}
