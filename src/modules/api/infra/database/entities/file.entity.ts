import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'files' })
export class File extends AbstractEntity {
  @Column({ nullable: true })
  public url: string;

  @Column({ unique: true, nullable: false })
  public key: string;
}
