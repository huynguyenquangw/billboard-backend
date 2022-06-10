import { Module } from '@nestjs/common';
import { PlanController } from './plans.controller';
import { PlanService } from './plans.service';

@Module({
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
