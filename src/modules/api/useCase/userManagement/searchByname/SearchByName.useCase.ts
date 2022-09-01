import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { UsersPageOptionsDto } from 'src/modules/api/infra/dtos/usersPageOptions.dto.ts/UsersPageOptions.dto';
import { UserInfoDto } from 'src/modules/api/users/dto/user-info.dto';
import { User } from 'src/modules/api/users/user.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class SearchUserByNameUseCase {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   * Get all users by name
   */
  async searchByName(
    pageOptionsDto: UsersPageOptionsDto,
    selectedName: string,
  ): Promise<PageDto<UserInfoDto>> {
    const searchUser = await this._userRepository.findAndCount({
        order: {
          createdAt: pageOptionsDto.order,
        },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        relations: ['ward', 'ward.district', 'ward.district.city'],
        where: {
            name: ILike(`%${selectedName}%`),
        },
      });
  
      const itemCount = searchUser[1];
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  
      return new PageDto(searchUser[0], pageMetaDto);
  }

  /**
   * Get all deleted users by name
   */
   async searchDeletedByName(
    pageOptionsDto: UsersPageOptionsDto,
    selectedName: string,
  ): Promise<PageDto<UserInfoDto>> {
    const searchUser = await this._userRepository.findAndCount({
        order: {
          createdAt: pageOptionsDto.order,
        },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        relations: ['ward', 'ward.district', 'ward.district.city'],
        where: {
            name: ILike(`%${selectedName}%`),
            deletedAt: Not(IsNull()),
        },
        withDeleted: true
      });
  
      const itemCount = searchUser[1];
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  
      return new PageDto(searchUser[0], pageMetaDto);
  }
}