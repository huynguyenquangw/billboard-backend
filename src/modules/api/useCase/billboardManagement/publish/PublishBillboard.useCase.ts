import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardsService } from 'src/modules/api/billboards/billboards.service';
import { Repository } from 'typeorm';

@Injectable()
// implements IUseCase<Request, Promise<Response>>
export class PublishBillboardUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly _billboardRepository: Repository<Billboard>,
    private readonly _billboardsService: BillboardsService,
  ) {}

  async execute(ownerId: string, billboardId: string): Promise<Billboard> {
    try {
      const selectedBillboard =
        await this._billboardsService.findOneWithRelations(billboardId);

      // check right owner
      if (selectedBillboard.owner.id !== ownerId) {
        throw new ForbiddenException('Forbidden');
      }

      // check current status - DRAFT
      if (selectedBillboard.status !== StatusType.DRAFT) {
        throw new Error('Cannot publish this billboard');
      }

      selectedBillboard.status = StatusType.PENDING;
      return this._billboardRepository.save(selectedBillboard);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
