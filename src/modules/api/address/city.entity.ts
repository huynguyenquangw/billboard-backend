import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { District } from './district.entity';

// @Entity({ name: 'cities' })
@Entity('cities')
export class City extends AbstractEntity {
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

  // @Index({ spatial: true })
  // @Column({
  //   type: 'geography',
  //   spatialFeatureType: 'Point',
  //   srid: 4326,
  //   nullable: true,
  // })
  // location: Point;

  @OneToMany(() => District, (district: District) => district.city)
  districts: District[];

  // toDto(): CityDto {
  //   return new CityDto(this);
  // }
}
