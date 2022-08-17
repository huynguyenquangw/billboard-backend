import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType, StatusType } from 'src/constants';
import { Plan } from 'src/modules/api/plans/entities/plans.entity';
import { UsersService } from 'src/modules/api/users/users.service';
import { IsNull, Not, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class DeleteAndRestorePlansUseCase {
  constructor(
    @InjectRepository(Plan)
    private readonly plansRepo: Repository<Plan>,
    private readonly _usersService: UsersService,
  ) {}

  /**
   * Soft Delete a plan
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
        'Cannot find plan with given id',
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
    planToDelete.status = StatusType.DELETED;
    await this.plansRepo.save(planToDelete);
    const deleteResponse = await this.plansRepo.softDelete(planId);

    if (!deleteResponse.affected) {
      throw new NotFoundException('Delete failed!');
    }

    return deleteResponse;
  }

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

    //Restore and change is_active back to hidden
    plantoRestore.status = StatusType.HIDDEN;
    await this.plansRepo.save(plantoRestore);
    const restoreResponse = await this.plansRepo.restore(planId);

    if (!restoreResponse.affected) {
      throw new NotFoundException('Restore failed!');
    }

    return restoreResponse;
  }
}
