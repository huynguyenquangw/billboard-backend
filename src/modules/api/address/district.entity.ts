import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { City } from './city.entity';
import { Ward } from './ward.entity';

@Entity({ name: 'districts' })
export class District extends AbstractEntity {
  @Column({ nullable: false, unique: true, default: '' })
  name: string;

  @Column({ nullable: true, unique: true })
  abbreviation: string;

  @Column({ nullable: true, default: null })
  zip: number;

  @Column({ nullable: true, default: null })
  photo: string;

  @ManyToOne(() => City, (city: City) => city.districts)
  // @JoinColumn()
  city: City;

  @OneToMany(() => Ward, (ward: Ward) => ward.district)
  wards: Ward[];

  // @OneToMany(() => BillboardEnity, (billboard) => billboard.district, {
  //   onDelete: 'SET NULL',
  // })
  // billboard: BillboardEnity[];
}
