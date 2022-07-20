import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('previousClients')
export class previousClient extends AbstractEntity {
  @Column({ nullable: false, unique: true, default: '' })
  clientName: string;

  @Column({ nullable: true, unique: true })
  clientLogo: string;
 
}