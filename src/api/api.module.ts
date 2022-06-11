import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BillboardsModule } from './billboards/billboards.module';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, BillboardsModule, PlansModule, AuthModule],
})
export class ApiModule {}
