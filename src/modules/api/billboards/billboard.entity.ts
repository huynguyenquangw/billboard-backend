import { StatusType } from 'src/constants';
import { DistrictEntity } from 'src/modules/api/address/district.entity';
import { UserEntity } from 'src/modules/api/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('billboard')
export class BillboardEnity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.billboard, {onDelete: 'SET NULL'})
  user: UserEntity;

  @ManyToOne(() => DistrictEntity, (district) => district.billboard, {onDelete: 'SET NULL'})
  district: DistrictEntity;

  @Column({default: ''})
  address: string;

  @Column({default: ''})
  area: string;

  @Column({default: ''})
  name: string;

  @Column('simple-array', {default: ['']}) 
  picture: string[];

  @Column({default: ''}) 
  video: string;

  @Column({default: 0})
  size_x: number;

  @Column({default: 0})
  size_y: number;

  @Column({default: 0})
  circulation: number;

  @Column({default: ''})
  previousClient: string;

  @Column({default: 0})
  rentalPrice: number;

  @Column({default: ''})
  rentalDuration: string;

  @Column({default:''})
  description: string;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.DRAFT,
  })
  status: StatusType;

  @Column('bool', {default:0})
  isRented: boolean;

  @Column('bool', {default: 0}) 
  isDeleted: boolean;
}
