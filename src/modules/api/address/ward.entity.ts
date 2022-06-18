import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('wards')
export class Ward extends AbstractEntity {
  @Column()
  name: string;
}
