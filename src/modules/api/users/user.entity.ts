import { RoleType } from 'src/constants/role-type';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillboardEnity } from '../billboards/billboard.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ type: 'varchar', length: 120 })
  email: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' , default: ()=> 'CURRENT_TIMESTAMP'})
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // @OneToMany(() => BillboardEnity, (billboard) => billboard.user)
  // billboard: BillboardEnity[];
}
