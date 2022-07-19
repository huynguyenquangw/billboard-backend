import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class DeleteAndRestoreBillboardUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepo: Repository<Billboard>,
  ) {}

  /**
   * Soft delete a billboard
   */
  async delete(
    ownerId: string,
    billboardId: string,
  ): Promise<UpdateResult | void> {
    const billboardToDelete = await this._billboardRepo.findOne({
      where: { id: billboardId },
    });

    // Check owner
    if (billboardToDelete.owner.id !== ownerId) {
      throw new ForbiddenException('Cannot delete this billboard');
    }

    const deleteResponse = await this._billboardRepo.softDelete(billboardId);
    if (!deleteResponse.affected) {
      throw new NotFoundException('Billboard with given id is not exist');
    }
    return deleteResponse;
  }

  /**
   * Restore a soft-deleted user
   */
  async restore(ownerId: string, billboardId: string): Promise<UpdateResult> {
    const billboardToRestore = await this._billboardRepo.findOne({
      where: { id: billboardId },
      withDeleted: true,
    });

    // Check active
    if (billboardToRestore && !billboardToRestore.deletedAt) {
      throw new ForbiddenException('Billboard with given id is active');
    }

    // Check owner
    if (billboardToRestore.owner.id !== ownerId) {
      throw new ForbiddenException('Cannot restore this billboard');
    }

    const restoreResponse = await this._billboardRepo.restore(billboardId);
    if (!restoreResponse.affected) {
      throw new NotFoundException('Billboard with given id is not exist');
    }
    return restoreResponse;
  }
}
