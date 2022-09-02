import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { File } from '../../infra/database/entities/file.entity';
import { Contract } from './contract.entity';

@Entity({ name: 'private_files' })
export class PrivateFile extends File {
  @OneToOne(() => Contract, (contract: Contract) => contract.privateFile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;
}
