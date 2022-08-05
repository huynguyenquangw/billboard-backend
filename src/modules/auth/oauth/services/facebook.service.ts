import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { AuthType } from 'src/constants';
import { UsersService } from 'src/modules/api/users/users.service';
import { LoginPayLoadDto } from '../dto/login-payload.dto';

@Injectable()
export class FacebookService {
  constructor(
    private readonly _http: HttpService,
    private readonly _usersService: UsersService,
  ) {}

  async facebookLogin(loginPayloadDto: LoginPayLoadDto) {
    const social_access_token = loginPayloadDto.social_access_token;
    const info_fields = 'id,name,birthday,email,gender,picture';
    const info_url = `https://graph.facebook.com/me?fields=${info_fields}&access_token=${social_access_token}`;
    try {
      const res = await this._http.get(info_url).toPromise();

      const user = await this.findOrCreateUser(res);

      const apiSuccessResponse = {
        status: { code: 200, message: 'SUCCESS' },
        data: {
          access_token: sign(
            {
              userId: user.id,
            },
            process.env.SOFTDEV_BILLBOARD_SECRET,
          ),
        },
      };
      return apiSuccessResponse;
    } catch (error) {
      console.error(error);
    }
  }

  async findOrCreateUser(response) {
    const user = await this._usersService.findExistUser(
      // response.data.
      AuthType.FACEBOOK,
      response.data.email,
    );

    if (user?.deletedAt) {
      throw new UnauthorizedException('Cannot login with a banned account');
    }

    if (!user) {
      const userData = {
        authType: AuthType.FACEBOOK,
        authProviderId: response.data.id,
        email: response.data.email,
        name: response.data.name,
        avatar: response.data.picture.data.url,
      };
      const newUser = await this._usersService.create(userData);

      return newUser;
    }

    return user;
  }
}
