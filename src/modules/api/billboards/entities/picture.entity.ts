import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { File } from '../../infra/database/entities/file.entity';
import { Billboard } from '../billboard.entity';

@Entity({ name: 'pictures' })
export class Picture extends File {
  @ManyToOne(() => Billboard, (billboard: Billboard) => billboard.pictures)
  @JoinColumn({ name: 'billboard_id' })
  billboard: Billboard;
}
