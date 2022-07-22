import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { User } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetAllUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   * Get all users
   * by id
   */
  async execute(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    try {
      const queryBuilder = this._userRepository.createQueryBuilder('users');

      queryBuilder
        .orderBy('users.createdAt', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .withDeleted()
        .leftJoinAndSelect('users.ward', 'wards')
        .leftJoinAndSelect('wards.district', 'districts')
        .leftJoinAndSelect('districts.city', 'cities');

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  //   async getUsers(
  //
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
