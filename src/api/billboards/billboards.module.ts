import { Module } from '@nestjs/common';
import { BillboardsController } from './billboards.controller';
import { BillboardsService } from './billboards.service';

@Module({
  controllers: [BillboardsController],
  providers: [BillboardsService],
})
export class BillboardsModule {}
