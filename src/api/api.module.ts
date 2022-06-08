import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BillboardModule } from './billboard/billboard.module';
import { PlanModule } from './plan/plan.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, BillboardModule, PlanModule, AuthModule],
})
export class ApiModule {}
