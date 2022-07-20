// import { Point } from 'geojson';
import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Billboard } from '../billboards/billboard.entity';
import { District } from './district.entity';

@Entity({ name: 'wards' })
export class Ward extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'double precision', name: 'lat', nullable: true })
  lat: number;

  @Column({ type: 'double precision', name: 'long', nullable: true })
  long: number;

  @ManyToOne(() => District, (district: District) => district.wards)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @OneToMany(() => Billboard, (billboard: Billboard) => billboard.ward)
  billboards: Billboard[];
}
