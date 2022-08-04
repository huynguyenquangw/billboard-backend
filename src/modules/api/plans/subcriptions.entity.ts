import { AbstractEntity } from 'src/common/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'subcriptions' })
export class Subcription extends AbstractEntity {

}