import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType, StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardsService } from 'src/modules/api/billboards/billboards.service';
import { Plan } from 'src/modules/api/plans/plans.entity';
import { UsersService } from 'src/modules/api/users/users.service';
import { IsNull, Not, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class DeletePlansUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly plansRepo: Repository<Plan>,
    private readonly _usersService: UsersService,
  ) {}

  /**
   * Restore a deleted billboard
   * by ADMIN
   */
  async delete(
      userId : string,
      planId: string): Promise<UpdateResult> {
    const planToDelete = await this.plansRepo.findOne({
      where: { id: planId },
      withDeleted: true,
    });

    //Check exist
    if (!planToDelete) {
      throw new NotFoundException(
        'Cannot find deleted billboard with given id',
      );
    }

    //Check is Admin
    const currentUser = await this._usersService.findOne(userId);
    if (!currentUser) {
      throw new NotFoundException('User with token is not exist!');
    }

    if (
      currentUser.role !== RoleType.ADMIN
    ) {
      throw new ForbiddenException('Cannot delete this plan');
    }

    //Soft Delete
    const deleteResponse = await this.plansRepo.softDelete(planId);

    if (!deleteResponse.affected) {
      throw new NotFoundException('Delete failed!');
    }

    return deleteResponse;
  }
}