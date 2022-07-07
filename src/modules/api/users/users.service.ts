import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { Repository } from 'typeorm';
import { AddressService } from '../address/address.service';
import { OauthCreateUserDto } from './dto/oauth-create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly addressService: AddressService,
  ) {}

  /**
   * Create a user
   */
  async createUser(oauthCreateUserDto: OauthCreateUserDto): Promise<User> {
    const newUser: User = await this.userRepository.create({
      ...oauthCreateUserDto,
    });

    return await this.userRepository.save(newUser);
  }

  /**
   * Get 1 user
   * by id
   */
  async getUserById(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
      relations: ['ward', 'ward.district', 'ward.district.city'],
    });
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  /**
   * test get users with pagination
   * by id
   */
  async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserInfoDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    queryBuilder
      .orderBy('users.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * ADMIN
   * Get 1 user
   * no filter out soft-deleted
   */
  async getUserByIdWithDeleted(id: string): Promise<UserInfoDto> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (user) {
      return user;
    }
    throw new NotFoundException(id);
  }

  /**
   * Get 1 user
   * by email
   * by authType
   */
  async findExistUser(email, authType): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email, authType: authType },
    });
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserInfoDto[]> {
    const users = await this.userRepository.find({
      relations: {
        ward: true,
      },
    });
    if (!users) {
      throw new NotFoundException();
    }
    return users;
  }

  /**
   * ADMIN
   * Get all users
   * no filter out soft-deleted
   */
  async getAllUsersWithDeleted(): Promise<UserInfoDto[]> {
    const users = await this.userRepository.find({
      withDeleted: true,
    });
    if (users) {
      return users;
    }
    throw new NotFoundException();
  }

  /**
   * Update a user
   */
  async updateUser(id: string, body: UpdateUserDto): Promise<UserInfoDto> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });

    if (!userToUpdate) {
      throw new NotFoundException();
    }

    let fullUpdateData = {};
    if (body.wardId) {
      const { wardId, ...updateData } = body;
      const ward = await this.addressService.getOneWard(wardId);
      // console.log(ward);

      fullUpdateData = { ...updateData, ward: { ...ward } };
      console.log(body);
      console.log(fullUpdateData);
    } else {
      fullUpdateData = body;
    }

    await this.userRepository.update(id, fullUpdateData);

    return this.getUserById(id);
  }

  /**
   * ADMIN
   * Soft delete a user
   */
  async deleteUser(id: string): Promise<void> {
    const deleteResponse = await this.userRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(id);
    }
  }

  /**
   * ADMIN
   * Restore a soft-deleted user
   */
  async restoreDeletedUser(id: string) {
    const restoreResponse = await this.userRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new NotFoundException(id);
    }
  }
}
