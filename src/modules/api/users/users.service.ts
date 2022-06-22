import { HttpService, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthCreateUserDto } from './dto/oauth-create-user.dto';
import { UserDto } from './dto/UserDto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;
  constructor(
    private readonly httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  // public async getUserInfo(token: string): Promise<UserDto> {
  // const headers = {
  //   Authorization: `Bearer ${token}`,
  // };
  // const response = await this.httpService
  //   .get('http://localhost:9000/api/users/profile', { headers })
  //   .toPromise();
  //   return new UserDto(response.data);
  // }

  public getUserById(id: string): Promise<UserDto> {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  async createUser(
    oauthCreateUserDto: OauthCreateUserDto,
  ): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();

    user.authType = oauthCreateUserDto.authType;
    user.authProviderId = oauthCreateUserDto.authProviderId;
    user.email = oauthCreateUserDto.email;
    user.name = oauthCreateUserDto.name;
    user.avatar = oauthCreateUserDto.avatar;

    return this.userRepository.save(user);
  }

  async findExistUser(email, authType) {
    return this.userRepository.findOne({
      where: [{ authType: authType }, { email: email }],
    });
  }

  async deleteUser(id: string) {
    const isDeleted = true;

    const result = this.userRepository
      .createQueryBuilder()
      .update({
        isDeleted: isDeleted,
      })
      .where({
        id: id,
      })
      .returning('*')
      .execute()
      .then((response) => {
        return response.raw[0];
      });

    return { result };
  }

  async findOneByToken(id: string): Promise<UserEntity>{
    return this.userRepository.findOne({where:{id: id}})
  }

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
