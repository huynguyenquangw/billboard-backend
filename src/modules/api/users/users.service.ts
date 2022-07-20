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
    private readonly userRepository: Repository<User>,
    private readonly addressService: AddressService,
  ) {}

  /**
   * Find only ONE user
   * by id
   */
  async findOne(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException(id);
  }

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
  async getOneWithAddress(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
      relations: ['ward', 'ward.district', 'ward.district.city'],
    });
    if (user) {
      return user;
    }
    throw new NotFoundException(id);
  }

  /**
   * ADMIN
   * Get 1 user
   * no filter out soft-deleted
   */
  async getOne(id: string): Promise<UserInfoDto> {
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

    let updateData = {};
    if (body.wardId) {
      const { wardId, ...newData } = body;
      const ward = await this.addressService.getOneWard(wardId);

      updateData = { ...newData, ward: { ...ward } };
    } else {
      updateData = body;
    }

    await this.userRepository.update(id, updateData);
    return this.getOneWithAddress(id);
  }
}
