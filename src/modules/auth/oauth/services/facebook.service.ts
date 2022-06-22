import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthType } from 'src/constants';
import { UserEntity } from 'src/modules/api/users/user.entity';
import { UsersService } from 'src/modules/api/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class FacebookService {
  constructor(
    @InjectRepository(UserEntity)
    protected userRepo: Repository<UserEntity>,
    private readonly http: HttpService,
    private readonly usersService: UsersService,
  ) {}

  async facebookLogin(social_access_token) {
    const info_fields = 'id,name,birthday,email,gender,picture';
    const info_url = `https://graph.facebook.com/me?fields=${info_fields}&access_token=${social_access_token}`;
    try {
      const res = await this.http.get(info_url).toPromise();
      this.findOrCreateUser(res);

      const apiResponse = {
        status: { code: 200, message: 'Success' },
        data: { access_token: 'webspatoken324fdsgrwt45ht526t32rg' },
      };
      return apiResponse;
    } catch (error) {
      console.error(error);
    }
  }

  findOrCreateUser(response) {
    const user = this.usersService.findExistUser(
      response.data.email,
      AuthType.FACEBOOK,
    );
    console.log(response.data);

    if (!user) {
      const userData = {
        authType: AuthType.FACEBOOK,
        authProviderId: response.data.id,
        email: response.data.email,
        name: response.data.name,
        avatar: response.data.picture.data.url,
      };
      this.usersService.createUser(userData);
    }
  }
}
