import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Ward extends AbstractEntity {
  @Column()
  name: string;
}
