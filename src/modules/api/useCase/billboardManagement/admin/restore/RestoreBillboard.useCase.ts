import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardsService } from 'src/modules/api/billboards/billboards.service';
import { IsNull, Not, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class RestoreBillboardUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepo: Repository<Billboard>,
    private readonly _billboardsService: BillboardsService,
  ) {}

  /**
   * Restore a deleted billboard
   * by ADMIN
   */
  async restore(billboardId: string): Promise<UpdateResult> {
    const billboardToRestore = await this._billboardRepo.findOne({
      where: { id: billboardId, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });

    // Check active
    if (!billboardToRestore) {
      throw new NotFoundException(
        'Cannot find deleted billboard with given id to restore',
      );
    }

    //TODO: change status to DRAFT, save and restore billboard
    billboardToRestore.status = StatusType.DRAFT;
    await this._billboardRepo.save(billboardToRestore);
    const restoreResponse = await this._billboardRepo.restore(billboardId);

    if (!restoreResponse.affected) {
      throw new NotFoundException('Restore failed!');
    }

    return restoreResponse;
  }
}
