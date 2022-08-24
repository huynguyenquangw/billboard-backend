import { AbstractEntity } from 'src/common/abstract.entity';
import { StatusType } from 'src/constants';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Billboard } from '../../billboards/billboard.entity';
import { ContractInfoDto } from '../dtos/contract-info.dto';
import { PrivateFile } from './privateFile.entity';

@Entity({ name: 'contracts' })
export class Contract extends AbstractEntity {
  @OneToMany(() => PrivateFile, (privateFile) => privateFile.contract, {
    eager: true,
    cascade: true,
  })
  privateFiles: PrivateFile[];

  @ManyToOne(() => Billboard, (billboard) => billboard.contracts)
  @JoinColumn({ name: 'billboard_id' })
  billboard: Billboard;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false, default: StatusType.ACTIVE })
  status: StatusType = StatusType.ACTIVE;

  @Column({ nullable: false })
  tenantName: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: false })
  startDate: Date;

  @Column({ nullable: false })
  endDate: Date;

  toDto(): ContractInfoDto {
    return new ContractInfoDto(this);
  }
}
