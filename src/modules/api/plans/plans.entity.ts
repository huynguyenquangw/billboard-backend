import { AbstractEntity } from 'src/common/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Subscription } from './subscriptions.entity';
// import { UserEntity } from '../users/user.entity';

@Entity({ name: 'plans' })
export class Plan extends AbstractEntity {
  @OneToMany(() => Subscription, subscription => subscription.plan)
  public subscriptions: Subscription[];
  
  @Column({ default: '' })
  code: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0 })
  duration: number;

  @Column({ default: 0 })
  post_limit: number;

  @Column({type: 'bool', default: 0 })
  is_active: boolean;

  @Column({default:''})
  description: string;

  @DeleteDateColumn({
    select: false,
    type: 'timestamp without time zone',
    name: 'deleted_at',
  })
  deletedAt: Date;
}
