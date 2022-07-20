import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/api/users/users.service';

@Injectable()
export class LoggedInUserRoleCheckUseCase {
  constructor(
    private readonly _usersService: UsersService, // private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find one user
   * by id
   */
  async execute(id: string): Promise<string> {
    try {
      const user = await this._usersService.findOne(id);
      return `Hello ${user.name}, your role is ${user.role.toLowerCase()}`;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
