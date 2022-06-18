import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('districts')
export class DistrictEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  abbreviation: string;

  @Column()
  zip: string;

  // @OneToMany(() => BillboardEnity, (billboard) => billboard.district, {
  //   onDelete: 'SET NULL',
  // })
  // billboard: BillboardEnity[];
}
