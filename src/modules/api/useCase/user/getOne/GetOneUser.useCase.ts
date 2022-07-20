import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/api/users/user.entity';
import { UsersService } from 'src/modules/api/users/users.service';

@Injectable()
export class GetOneUserUseCase {
  constructor(
    private readonly _usersService: UsersService, // private readonly userRepository: Repository<User>,
  ) {}

  async execute(id: string): Promise<User> {
    try {
      const user = await this._usersService.findOne(id);
      return user;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
