import { AbstractEntity } from 'src/common/abstract.entity';
import { StatusType } from 'src/constants';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Ward } from '../address/ward.entity';
import { User } from '../users/user.entity';
import { BillboardInfoDto } from './dto/billboard-info.dto';
import { Picture } from './entities/picture.entity';
// import { UserEntity } from '../users/user.entity';

@Entity({ name: 'billboards' })
export class Billboard extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.billboards)
  owner: User;

  @ManyToOne(() => Ward)
  @JoinColumn({ name: 'ward_id' })
  ward: Ward;

  @OneToMany(() => Picture, (picture) => picture.billboard, {
    eager: true,
    cascade: true,
  })
  pictures: Picture[];

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  address2: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  video: string;

  @Column({ default: 0 })
  size_x: number;

  @Column({ default: 0 })
  size_y: number;

  @Column({ default: 0 })
  circulation: number;

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
  status: StatusType;

  @Column({ type: 'bool', default: 0 })
  isRented: boolean;

  @Column({ default: 0 })
  rentedCounter?: number = 0;

  @Column({ default: 0 })
  likedCounter?: number = 0;

  @Column({
    nullable: true,
    type: 'timestamp without time zone',
    name: 'approved_at',
  })
  approvedAt: Date;

  @Column({ type: 'double precision', name: 'lat', nullable: true })
  lat: number;

  @Column({ type: 'double precision', name: 'long', nullable: true })
  long: number;

  @DeleteDateColumn({
    select: false,
    type: 'timestamp without time zone',
    name: 'deleted_at',
  })
  deletedAt: Date;

  toDto(): BillboardInfoDto {
    return new BillboardInfoDto(this);
  }
}
