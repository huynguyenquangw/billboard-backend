// import { Point } from 'geojson';
import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { District } from './district.entity';

@Entity({ name: 'wards' })
export class Ward extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'double precision', name: 'lat', nullable: true })
  lat: number;

  @Column({ type: 'double precision', name: 'long', nullable: true })
  long: number;

  // @Index({ spatial: true })
  // @Column({
  //   type: 'geography',
  //   spatialFeatureType: 'Point',
  //   srid: 4326,
  //   nullable: true,
  // })
  // location: Point;

  @ManyToOne(() => District, (district: District) => district.wards)
  @JoinColumn({ name: 'district_id' })
  district: District;
}
