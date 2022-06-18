import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthCreateUserDto } from './dto/oauth-create-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;

  async findExistUser(profileId, providerType) {
    return this.userRepository.findOne({
      where: [{ authType: providerType }, { authProviderId: profileId }],
    });
  }

  async createUser(body: OauthCreateUserDto): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();

    user.authType = body.authType;
    user.authProviderId = body.authProviderId;
    user.email = body.email;
    user.name = body.name;

    return this.userRepository.save(user);
  }

  // public getUserById(id: number): Promise<UserEntity> {
  //   return this.repository.findOneBy({ id: id });
  // }

  // async findOrCreate(userId: string, authProvider: AuthType): Promise<User> {
  //   // TODO Perform database lookup to extract more information about the user
  //   // or to create the user if the UserId is unknown to us.
  //   // For now, we'll skip this and always return the same dummy user, regardless of the `userId`.
  //   return {
  //     id: '42195',
  //     provider,
  //     providerId: '123',
  //     displayName: 'John Doe',
  //     photos: [{ value: 'https://avatars.githubusercontent.com/u/28536201' }],
  //   };
  // }
}
