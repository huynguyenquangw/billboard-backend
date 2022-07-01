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

  @Column({ nullable: true, default: null })
  zip: number;

  @Column({ nullable: true, default: null })
  photo: string;

  @OneToMany(() => District, (district: District) => district.city)
  districts: District[];

  // toDto(): CityDto {
  //   return new CityDto(this);
  // }
}
