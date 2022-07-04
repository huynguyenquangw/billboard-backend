import { AbstractEntity } from 'src/common/abstract.entity';
import { StatusType } from 'src/constants';
import { Column, Entity } from 'typeorm';
// import { UserEntity } from '../users/user.entity';

@Entity('billboards')
export class BillboardEnity extends AbstractEntity {
  // @ManyToOne(() => UserEntity, (user) => user.billboard, {
  //   onDelete: 'SET NULL',
  // })
  // user: UserEntity;

  // @ManyToOne(() => DistrictEntity, (district) => district.billboard, {
  //   onDelete: 'SET NULL',
  // })
  // district: DistrictEntity;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  address2: string;

  @Column({ default: '' })
  name: string;

  @Column('simple-array', { default: [''] })
  picture: string[];

  @Column({ default: '' })
  video: string;

  @Column({ default: 0 })
  size_x: number;

  @Column({ default: 0 })
  size_y: number;

  @Column({ default: 0 })
  circulation: number;

  @Column({ default: '' })
  previousClient: string;

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

  @Column('bool', { default: 0 })
  isRented: boolean;

  @Column('bool', { default: 0 })
  isDeleted: boolean;
}
