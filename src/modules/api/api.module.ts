import { Module } from '@nestjs/common';
import { BillboardsModule } from './billboards/billboards.module';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, BillboardsModule, PlansModule],
})
export class ApiModule {}
