import { AbstractEntity } from 'src/common/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Subscription } from './subscriptions.entity';

@Entity({ name: 'transactions' })
export class Transaction extends AbstractEntity {
    @OneToOne(() => Subscription)
    @JoinColumn()
    subscription: Subscription;

    @Column({default: ''})
    maker_name: string;

    @Column({default: 0})
    total_cost: number;

    @Column({default: ''})
    method: string;

}