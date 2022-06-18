import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthType } from 'src/constants/auth-type';
import { UsersService } from 'src/modules/api/users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService, // private readonly userRepository: Repository<UserEntity>,
    private usersService: UsersService, // private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    try {
      // console.log('access token: ', accessToken);
      // console.log('refresh token: ', refreshToken);
      // console.log('profile: ', profile);
      let payload = {};

      // Check whether this user exists in the database
      const user = await this.usersService
        .findExistUser(profile.id, AuthType.FACEBOOK)
        .then((user) => user.toDto());

      payload = {
        message: 'This user already exists',
        user,
        accessToken,
      };

      if (user) {
        console.log(payload);
        return done(null, payload);
      }

      const fullname = `${profile.name.familyName}${
        profile.name.middleName ? ` ${profile.name.middleName}` : ''
      } ${profile.name.givenName}`;
      console.log('fullname ', fullname);

      const userData = {
        authType: AuthType.FACEBOOK,
        authProviderId: profile.id,
        email: profile.emails[0].value,
        name: fullname,
      };

      const newUser = await this.usersService.createUser(userData);
      const newUserDto = await newUser.toDto();
      payload = {
        message: 'A new user created',
        newUserDto,
        accessToken,
      };
      console.log(payload);
      done(null, payload);
    } catch (error) {
      done(error, false);
    }
  }
}
