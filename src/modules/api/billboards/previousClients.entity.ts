import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('previous_clients')
export class PreviousClient extends AbstractEntity {
  @Column({ nullable: false, unique: true, default: '' })
  client_name: string;

  @Column({ nullable: true, unique: true })
  client_logo: string;
}
