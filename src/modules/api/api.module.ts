import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { BillboardsModule } from './billboards/billboards.module';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, BillboardsModule, PlansModule, AddressModule],
})
export class ApiModule {}
