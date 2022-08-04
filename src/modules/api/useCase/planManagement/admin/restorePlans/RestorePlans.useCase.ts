import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardsService } from 'src/modules/api/billboards/billboards.service';
import { Plan } from 'src/modules/api/plans/plans.entity';
import { IsNull, Not, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class RestorePlansUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly plansRepo: Repository<Plan>,
  ) {}

  /**
   * Restore a deleted plan
   * by ADMIN
   */
  async restore(planId: string): Promise<UpdateResult> {
    const plantoRestore = await this.plansRepo.findOne({
      where: { 
          id: planId, 
          deletedAt: Not(IsNull()) },
      withDeleted: true,
    });

    // Check active
    if (!plantoRestore) {
      throw new NotFoundException(
        'Cannot find deleted plan with given id to restore',
      );
    }

    //Restore and change is_active back to false
    plantoRestore.is_active = false;
    await this.plansRepo.save(plantoRestore);
    const restoreResponse = await this.plansRepo.restore(planId);

    if (!restoreResponse.affected) {
      throw new NotFoundException('Restore failed!');
    }

    return restoreResponse;
  }
}