import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { District } from './district.entity';

@Entity({ name: 'wards' })
export class Ward extends AbstractEntity {
  @Column()
  name: string;

  @ManyToOne(() => District, (district: District) => district.wards)
  @JoinColumn()
  district: District;
}
