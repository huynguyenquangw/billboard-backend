import { AbstractDto } from 'src/common/dtos/abstract.dto';
import { StatusType } from 'src/constants';
import { Billboard } from '../../billboards/billboard.entity';
import { Contract } from '../entities/contract.entity';

export class ContractInfoDto extends AbstractDto {
  readonly code: string;

  readonly status: StatusType;

  readonly tenantName: string;

  readonly note: string;

  readonly startDate: Date;

  readonly endDate: Date;

  readonly privateFile: object;

  readonly billboard: Billboard;

  constructor(contract: Contract) {
    super(contract);

    this.code = contract.code;
    this.status = contract.status;
    this.tenantName = contract.tenantName;
    this.note = contract.note;
    this.startDate = contract.startDate;
    this.endDate = contract.endDate;
    this.privateFile = contract.privateFile;
    this.billboard = contract.billboard;
  }
}
