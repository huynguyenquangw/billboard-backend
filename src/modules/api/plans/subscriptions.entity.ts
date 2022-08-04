import { AbstractEntity } from 'src/common/abstract.entity';
import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { Plan } from './plans.entity';
import { User } from '../users/user.entity';
import { StatusType } from 'src/constants';
import { Exclude } from 'class-transformer';


@Entity({ name: 'subcriptions' })
export class Subscription extends AbstractEntity {
  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  plan: Plan;

  @ManyToOne(() => User, (user) => user.subscriptions)
  subscriber: User;

  @Column({ default: 0 })
  remaining_post: number;

  @Column({ nullable: true })
  end_at: Date;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.PENDING,
  })
  @Exclude()
  status: StatusType;


}