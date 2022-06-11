import { Module } from '@nestjs/common';
import { BillboardModule } from './billboards/billboard.module';
import { PlanModule } from './plans/plan.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [UserModule, BillboardModule, PlanModule],
})
export class ApiModule {}
