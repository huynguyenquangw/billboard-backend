import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('cities')
export class City extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  abbreviation: string;

  @Column()
  zip: string;
}
