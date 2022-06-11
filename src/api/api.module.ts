import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GoogleModule } from './auth/google/google.module';
import { BillboardModule } from './billboards/billboards.module';
import { PlanModule } from './plans/plans.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [UserModule, BillboardModule, PlanModule, GoogleModule],
})
export class ApiModule {}
