import { AbstractEntity } from 'src/common/abstract.entity';
import { StatusType } from 'src/constants';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { Subscription } from './subscriptions.entity';
// import { UserEntity } from '../users/user.entity';

@Entity({ name: 'plans' })
export class Plan extends AbstractEntity {
  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  public subscriptions: Subscription[];

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0 })
  duration: number;

  // TODO: 1 user with 10 post limit = PENDING + APPROVED
  @Column({ default: 0 })
  postLimit: number;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.HIDDEN })
  status: StatusType;

  @Column({ default: '' })
  description: string;

  @DeleteDateColumn({
    select: false,
    type: 'timestamp without time zone',
    name: 'deleted_at',
  })
  deletedAt: Date;
}
