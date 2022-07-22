import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/abstract.entity';
import { StatusType } from 'src/constants';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Ward } from '../address/ward.entity';
import { User } from '../users/user.entity';
import { BillboardInfoDto } from './dto/billboard-info.dto';
// import { UserEntity } from '../users/user.entity';

@Entity({ name: 'billboards' })
export class Billboard extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.billboards)
  owner: User;

  @ManyToOne(() => Ward)
  @JoinColumn()
  ward: Ward;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  address2: string;

  @Column({ default: '' })
  name: string;

  @Column('jsonb', { nullable: true })
  picture: object[];

  @Column({ default: '' })
  video: string;

  @Column({ default: 0 })
  size_x: number;

  @Column({ default: 0 })
  size_y: number;

  @Column({ default: 0 })
  circulation: number;

    /*
    TODO: Need to check
   */
  @Column('jsonb', { nullable: true })
  previousClient: object[];

  @Column({ default: 0 })
  rentalPrice: number;

  @Column({ default: '' })
  rentalDuration: string;

  @Column({ default: '' })
  description: string;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.DRAFT,
  })
  @Exclude()
  status: StatusType;

  @Column({ type: 'bool', default: 0 })
  isRented: boolean;

  @Column({ default: 0 })
  rentedCounter?: number = 0;

  @Column({ default: 0 })
  likedCounter?: number = 0;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  toDto(): BillboardInfoDto {
    return new BillboardInfoDto(this);
  }
}
