import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { RoleType } from 'src/constants';
import { UsersPageOptionsDto } from 'src/modules/api/infra/dtos/usersPageOptions.dto.ts/UsersPageOptions.dto';
import { UserInfoDto } from 'src/modules/api/users/dto/user-info.dto';
import { User } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetAllOperatorsUseCase {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   * Get all users include deleted
   */
  async executeAll(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserInfoDto>> {
    const queryBuilder = this._userRepository.createQueryBuilder('billboards');

    queryBuilder
      .orderBy('users.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where('users.role = :role', { role: RoleType.OPERATOR })
      .withDeleted()
      .leftJoinAndSelect('users.ward', 'wards')
      .leftJoinAndSelect('wards.district', 'districts')
      .leftJoinAndSelect('districts.city', 'cities')
      .addSelect('users.deletedAt');

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Get all billboard exclude deleted
   */
  async execute(
    isActive: string,
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserInfoDto>> {
    const queryBuilder = this._userRepository.createQueryBuilder('users');

    queryBuilder
      .orderBy('users.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where('users.role = :role', { role: RoleType.OPERATOR })
      .leftJoinAndSelect('users.ward', 'wards')
      .leftJoinAndSelect('wards.district', 'districts')
      .leftJoinAndSelect('districts.city', 'cities');

    switch (isActive) {
      case 'active':
        break;
      case 'inactive':
        queryBuilder
          .withDeleted()
          .addSelect('users.deletedAt')
          .where('users.deletedAt IS NOT NULL');
        break;
      default:
        break;
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
