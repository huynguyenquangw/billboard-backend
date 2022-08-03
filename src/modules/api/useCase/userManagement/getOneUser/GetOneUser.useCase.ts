import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetOneUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   * Get 1 user
   * include deleted
   */
  async execute(id: string): Promise<User> {
    try {
      const user = await this._userRepository.findOne({
        where: { id },
        withDeleted: true,
      });
      return user;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
