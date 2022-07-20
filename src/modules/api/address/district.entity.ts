// import { Point } from 'geojson';
import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { City } from './city.entity';
import { Ward } from './ward.entity';

@Entity({ name: 'districts' })
export class District extends AbstractEntity {
  @Column({ nullable: false, unique: true, default: '' })
  name: string;

  @Column({ nullable: true, unique: true })
  abbreviation: string;

  @Column({ name: 'photo_url', nullable: true, default: null })
  photoUrl: string;

  @Column({ type: 'double precision', name: 'lat', nullable: true })
  lat: number;

  @Column({ type: 'double precision', name: 'long', nullable: true })
  long: number;

  @ManyToOne(() => City, (city: City) => city.districts)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => Ward, (ward: Ward) => ward.district)
  wards: Ward[];

  // @OneToMany(() => BillboardEnity, (billboard) => billboard.district, {
  //   onDelete: 'SET NULL',
  // })
  // billboard: BillboardEnity[];
}
