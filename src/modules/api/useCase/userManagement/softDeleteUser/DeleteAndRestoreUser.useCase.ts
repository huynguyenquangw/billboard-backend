import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/api/users/user.entity';
import { IsNull, Not, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class DeleteAndRestoreUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
  ) {}

  /**
   * Soft delete a user
   */
  async delete(id: string): Promise<UpdateResult> {
    const deleteResponse = await this._userRepo.softDelete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('User with given id is not exist');
    }
    return deleteResponse;
  }

  /**
   * Restore a soft-deleted user
   */
  async restore(id: string): Promise<UpdateResult> {
    const userToRestore = await this._userRepo.findOne({
      where: { id: id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });

    // Check active
    if (!userToRestore) {
      throw new NotFoundException(
        'Cannot find deleted user with given id to restore',
      );
    }

    //TODO: change status to DRAFT, save and restore billboard
    const restoreResponse = await this._userRepo.restore(id);
    if (!restoreResponse.affected) {
      throw new NotFoundException('User with given id is not exist');
    }
    return restoreResponse;
  }
}
