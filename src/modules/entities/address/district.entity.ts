import { BillboardEnity } from 'src/modules/api/billboards/billboard.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('district')
export class DistrictEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  abbreviation: string;

  @Column()
  zip: string;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt!: Date;

  @OneToMany(() => BillboardEnity, (billboard) => billboard.district, {
    onDelete: 'SET NULL',
  })
  billboard: BillboardEnity[];
}
