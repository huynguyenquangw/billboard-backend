import { Module } from '@nestjs/common';
import { GoogleModule } from './auth/google/google.module';
import { BillboardsModule } from './billboards/billboards.module';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, BillboardsModule, PlansModule, GoogleModule],
})
export class ApiModule {}
