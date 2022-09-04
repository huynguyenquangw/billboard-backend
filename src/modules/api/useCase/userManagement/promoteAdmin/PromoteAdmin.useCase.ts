import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from 'src/constants';
import { User } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromoteAdminUseCase {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   * Get 1 user
   * include deleted
   */
  async execute(id: string, pw): Promise<User> {
    try {
      if (pw.text !== '123vietbangchu') {
        throw new ForbiddenException('Forbidden');
      }
      const user = await this._userRepository.findOne({
        where: { id: id, role: RoleType.USER },
      });
      return await this._userRepository.save({ ...user, role: RoleType.ADMIN });
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
