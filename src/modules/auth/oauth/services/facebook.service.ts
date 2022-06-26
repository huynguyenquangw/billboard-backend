import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { AuthType } from 'src/constants';
import { UserEntity } from 'src/modules/api/users/user.entity';
import { UsersService } from 'src/modules/api/users/users.service';
import { Repository } from 'typeorm';
import { LoginPayLoadDto } from '../dto/login-payload.dto';

@Injectable()
export class FacebookService {
  constructor(
    @InjectRepository(UserEntity)
    protected userRepo: Repository<UserEntity>,
    private readonly http: HttpService,
    private readonly usersService: UsersService,
  ) {}

  async facebookLogin(loginPayloadDto: LoginPayLoadDto) {
    const social_access_token = loginPayloadDto.social_access_token;
    const info_fields = 'id,name,birthday,email,gender,picture';
    const info_url = `https://graph.facebook.com/me?fields=${info_fields}&access_token=${social_access_token}`;
    try {
      const res = await this.http.get(info_url).toPromise();
      const userId = await this.findOrCreateUser(res);

      const apiResponse = {
        status: { code: 200, message: 'SUCCESS' },
        data: {
          access_token: sign(
            {
              userId: userId,
            },
            process.env.SOFTDEV_BILLBOARD_SECRET,
          ),
        },
      };
      return apiResponse;
    } catch (error) {
      console.error(error);
    }
  }

  async findOrCreateUser(response) {
    let userId = '';
    const user = await this.usersService.findExistUser(
      response.data.email,
      AuthType.FACEBOOK,
    );
    console.log('data: ', response.data);
    // console.log('user: ', (await user).email);

    if (!user) {
      const userData = {
        authType: AuthType.FACEBOOK,
        authProviderId: response.data.id,
        email: response.data.email,
        name: response.data.name,
        avatar: response.data.picture.data.url,
      };
      const newUser = await this.usersService.createUser(userData);

      userId = newUser.id;
      console.log('id: ', userId);
      return userId;
    }

    userId = user.id;
    console.log('id: ', userId);
    return userId;
  }
}
