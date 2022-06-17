import { StatusType } from 'src/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('billboard')
export class BillboardEnity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => UserEntity, (user) => user.billboard, {
  //   onDelete: 'SET NULL',
  // })
  // user: UserEntity;

  // @ManyToOne(() => DistrictEntity, (district) => district.billboard)
  // district: DistrictEntity;

  @Column()
  address: string;

  @Column()
  area?: string;

  @Column()
  name: string;

  @Column('simple-array') //Array contains an id and url link
  picture: string[];

  @Column('simple-array') //Array contains an id and url link
  video?: string[];

  @Column()
  size_x: number;

  @Column()
  size_y: number;

  @Column()
  circulation: number;

  @Column()
  previousClient?: string;

  @Column()
  rentalPrice: number;

  @Column()
  rentalDuration: number;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.DRAFT,
  })
  status: StatusType;

  @Column('bool')
  isRented: boolean;

  @Column('bool')
  isActive: boolean;
}
