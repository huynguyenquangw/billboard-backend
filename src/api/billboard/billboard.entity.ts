import { StatusType } from 'src/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Billboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  address2: string;

  @Column()
  name: string;

  @Column()
  picture: string;

  @Column()
  video: string;

  @Column()
  size_x: string;

  @Column()
  size_y: string;

  @Column()
  circulation: number;

  @Column()
  previous_client: string;

  @Column()
  rental_price: string;

  @Column()
  rental_duration: string;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.DRAFT,
  })
  status: string;

  @Column({ default: false })
  is_rented: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
