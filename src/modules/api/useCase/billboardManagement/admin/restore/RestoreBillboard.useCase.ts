import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class RestoreBillboardUseCase {
  private _billboardsService: any;
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepo: Repository<Billboard>,
  ) {}

  /**
   * Restore a deleted billboard
   * by ADMIN
   */
  async restore(billboardId: string): Promise<UpdateResult> {
    const billboardToRestore = await this._billboardRepo.findOne({
      where: { id: billboardId },
      withDeleted: true,
    });

    // Check active
    if (billboardToRestore && !billboardToRestore.deletedAt) {
      throw new ForbiddenException('Billboard with given id is active');
    }

    const restoreResponse = await this._billboardRepo.restore(billboardId);

    if (!restoreResponse.affected) {
      throw new NotFoundException('Billboard with given id is not exist');
    }

    //TODO: change status to DRAFT after restore
    const restoredBillboard = await this._billboardsService.findOne(
      billboardId,
    );
    restoredBillboard.status = StatusType.DRAFT;

    return restoreResponse;
  }
}
