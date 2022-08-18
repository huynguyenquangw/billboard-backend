import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/abstract.entity';
import { StatusType } from 'src/constants';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';
import { Plan } from './plans.entity';

@Entity({ name: 'subcriptions' })
export class Subscription extends AbstractEntity {
  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  plan: Plan;

  @ManyToOne(() => User, (user) => user.subscriptions)
  subscriber: User;

  @Column({nullable: true})
  code: string;

  // TODO: default remainingPost is postLimit
  @Column({ default: 0 })
  remainingPost: number;

  // TODO: endAt = subscribed day + duration
  // TODO: used for checking publish billboard
  // TODO: used for checking billboard
  @Column({ name: 'expired_at', nullable: true })
  expiredAt: Date;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.PENDING,
  })
  status: StatusType;
}
