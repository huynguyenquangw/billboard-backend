import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansController } from './plans.controller';
import { Plan } from './plans.entity';
import { PlansService } from './plans.service';
import { Subscription } from './subscriptions.entity';
import { Transaction } from './transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Subscription, Transaction])],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
