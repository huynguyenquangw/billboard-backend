import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PlansController } from './plans.controller';
import { Plan } from './entities/plans.entity';
import { PlansService } from './plans.service';
import { Subscription } from './entities/subscriptions.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Subscription, Transaction]),
  UsersModule
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports:[PlansService]
})
export class PlansModule {}
