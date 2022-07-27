import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardsService } from 'src/modules/api/billboards/billboards.service';
import { Repository } from 'typeorm';

@Injectable()
export class ApproveBillboardUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepository: Repository<Billboard>,
    private readonly _billboardsService: BillboardsService,
  ) {}

  /**
   * Approve billboard
   */
  async execute(id: string): Promise<Billboard> {
    try {
      const selectedBillboard = await this._billboardsService.findOne(id);

      // check current status - PENDING
      if (selectedBillboard.status !== StatusType.PENDING) {
        throw new Error('Cannot approve this billboard');
      }

      selectedBillboard.status = StatusType.APPROVED;
      selectedBillboard.approvedAt = new Date();
      return this._billboardRepository.save(selectedBillboard);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
