import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthCreateUserDto } from './dto/oauth-create-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  constructor(private jwtService: JwtService) {}

  /**
   * Get 1 user
   * by id
   */
  async getUserById(id: string): Promise<UserInfoDto> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException(id);
  }

  /**
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
   * Get all users
   */
  async getAllUsers(): Promise<UserInfoDto[]> {
    const users = await this.userRepository.find();
    if (users) {
      return users;
    }
    throw new NotFoundException();
  }

  /**
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

  async createUser(oauthCreateUserDto: OauthCreateUserDto): Promise<User> {
    const newUser: User = await this.userRepository.create({
      ...oauthCreateUserDto,
    });

    return await this.userRepository.save(newUser);
  }

  /**
   * Get user
   * by email
   * by authType
   */
  async findExistUser(email, authType): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email, authType: authType },
    });
  }

  /**
   * Soft delete a user
   */
  async deleteUser(id: string): Promise<void> {
    const deleteResponse = await this.userRepository.softDelete(id);
    if (!deleteResponse.affected) {
      // throw new UserNotFoundException(id);
      throw new NotFoundException(id);
    }
  }

  /**
   * Restore a soft-deleted user
   */
  async restoreDeletedUser(id: string) {
    const restoreResponse = await this.userRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new NotFoundException(id);
    }
  }
}
