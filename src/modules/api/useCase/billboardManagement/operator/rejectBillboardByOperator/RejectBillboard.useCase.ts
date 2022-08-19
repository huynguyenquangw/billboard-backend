import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { ActionType } from 'src/constants/action-type';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardsService } from 'src/modules/api/billboards/billboards.service';
import { PlansService } from 'src/modules/api/plans/plans.service';
import { Repository } from 'typeorm';

@Injectable()
export class RejectBillboardUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepository: Repository<Billboard>,
    private readonly _billboardsService: BillboardsService,
    private readonly _planService: PlansService
  ) { }

  /**
   * Reject billboard
   */
  async execute(id: string): Promise<Billboard> {
    try {
      const selectedBillboard = await this._billboardsService.findOneWithRelations(id);

      // check current status - PENDING
      if (selectedBillboard.status !== StatusType.PENDING) {
        throw new Error('Cannot reject this billboard');
      }

      // Check subscription
      const sub = await this._planService.checkSubByUser(selectedBillboard.owner.id);
      if (!sub) {
        throw new NotFoundException('Subscription not found');
      }

      await this._planService.handleRemainingPost(sub, ActionType.INC);
      selectedBillboard.status = StatusType.REJECTED;
      return this._billboardRepository.save(selectedBillboard);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
