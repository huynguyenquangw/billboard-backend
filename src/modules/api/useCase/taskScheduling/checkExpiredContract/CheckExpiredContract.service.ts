import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { Contract } from 'src/modules/api/contracts/entities/contract.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CheckExpiredContractService {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepo: Repository<Billboard>,
    @InjectRepository(Contract)
    private readonly _contractRepo: Repository<Contract>,
  ) {}
  private readonly logger = new Logger(CheckExpiredContractService.name);

  /**
   * Cron job
   * Check expired contract
   * Every midnight
   */
  // @Cron(CronExpression.EVERY_10_SECONDS)dd
  @Cron('0 0 0 * * *')
  async CheckExpiredContract() {
    // check all SUCCESS subscription
    const today = new Date();
    const expiredContracts: Contract[] = await this._contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.billboard', 'billboards')
      .where('contracts.status = :status', { status: StatusType.ACTIVE })
      .andWhere('contracts.endDate < :today', {
        today: today,
      })
      .getMany();

    const expiredContractAndUserIds = expiredContracts.map((contract) => {
      return {
        expiredContractId: contract.id,
        billboardId: contract.billboard.id,
      };
    });
    this.logger.debug(expiredContractAndUserIds);

    const contractQueryBuilder =
      this._contractRepo.createQueryBuilder('contracts');

    const billboardQueryBuilder =
      this._billboardRepo.createQueryBuilder('billboards');

    expiredContractAndUserIds.forEach((e) => {
      contractQueryBuilder
        .update(Contract)
        .set({ status: StatusType.EXPIRED })
        .where('id = :id', { id: e.expiredContractId })
        .execute();

      billboardQueryBuilder
        .update(Billboard)
        .set({ status: StatusType.APPROVED })
        .where('id = :id', { id: e.billboardId })
        .execute();
    });
  }
}
