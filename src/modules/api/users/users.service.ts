import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    private readonly _userRepository: Repository<User>,
    private readonly addressService: AddressService,
  ) {}

  /**
   * Find only ONE user
   * by id
   */
  async findOne(id: string): Promise<User> {
    const user: User = await this._userRepository.findOne({
      where: { id: id },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with given id is not exist');
  }

  /**
   * Find 1 user
   * by email
   * by authType
   */
  async findExistUser(
    // providerId,
    authType,
    email,
  ): Promise<User> {
    const user = await this._userRepository.findOne({
      select: ['id', 'deletedAt'],
      where: { email: email, authType: authType },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('Not Found');
    }

    return user;
  }

  /**
   * Get 1 user
   * by id
   */
  async getOneWithRelations(id: string): Promise<User> {
    const user: User = await this._userRepository.findOne({
      where: { id },
      relations: ['ward', 'ward.district', 'ward.district.city'],
    });
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  /**
   * Create a user
   */
  async create(oauthCreateUserDto: OauthCreateUserDto): Promise<User> {
    const newUser: User = await this._userRepository.create({
      ...oauthCreateUserDto,
    });

    return await this._userRepository.save(newUser);
  }

  /**
   * Update a user
   */
  async update(id: string, body: UpdateUserDto): Promise<User> {
    const userToUpdate = await this._userRepository.findOne({ where: { id } });

    if (!userToUpdate) {
      throw new NotFoundException();
    }

    let updateData = {};
    if (body.wardId) {
      const { wardId, ...newData } = body;
      const ward = await this.addressService.getOneWard(wardId);

      updateData = { ...newData, ward: { ...ward } };
    } else {
      updateData = body;
    }

    await this._userRepository.update(id, updateData);
    return await this.getOneWithRelations(id);
  }

  /**
   * TODO: admin
   * Get all active users
   */
  async getAllActiveUsers(): Promise<UserInfoDto[]> {
    const users = await this._userRepository.find({
      relations: ['ward', 'ward.district', 'ward.district.city'],
    });
    if (!users) {
      throw new NotFoundException();
    }
    return users;
  }
}
