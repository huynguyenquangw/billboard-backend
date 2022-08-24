import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';
import { File } from '../../infra/database/entities/file.entity';

@Entity({ name: 'private_files' })
export class PrivateFile extends File {
  @ManyToOne(() => Contract, (contract: Contract) => contract.privateFiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;
}
