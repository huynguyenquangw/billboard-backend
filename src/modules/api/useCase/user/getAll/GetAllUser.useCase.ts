import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/api/users/user.entity';
import { UsersService } from 'src/modules/api/users/users.service';

@Injectable()
export class GetAllUserUseCase {
  constructor(
    private readonly repo: UsersService, // private readonly userRepository: Repository<User>,
  ) {}

  /**
   * test get users with pagination
   * by id
   */
  async execute(id: string): Promise<User> {
    try {
      //   const user = await this._usersService.findOne(id);
      //   return user;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  //   async getUsers(
  //     pageOptionsDto: PageOptionsDto,
  //   ): Promise<PageDto<UserInfoDto>> {
  //     const queryBuilder = this.userRepository.createQueryBuilder('users');

  //     queryBuilder
  //       .orderBy('users.createdAt', pageOptionsDto.order)
  //       .skip(pageOptionsDto.skip)
  //       .take(pageOptionsDto.take);

  //     const itemCount = await queryBuilder.getCount();
  //     const { entities } = await queryBuilder.getRawAndEntities();

  //     const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  //     return new PageDto(entities, pageMetaDto);
  //   }
}
