// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Profile, Strategy } from 'passport-facebook';
// import { AuthType } from 'src/constants/auth-type';
// import { UsersService } from 'src/modules/api/users/users.service';

// @Injectable()
// export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
//   constructor(
//     private configService: ConfigService,
//     private usersService: UsersService,
//   ) {
//     super({
//       clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
//       clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
//       callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
//       scope: 'email',
//       profileFields: ['emails', 'name'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: Profile,
//     done: (err: any, user: any, info?: any) => void,
//   ): Promise<any> {
//     try {
//       let payload = {};

//       // Check whether this user exists in the database
//       const user = await this.usersService.findExistUser(
//         profile.id,
//         AuthType.FACEBOOK,
//       );

//       if (!user) {
//         const fullname = `${profile.name.givenName} ${profile.name.familyName}${
//           profile.name.middleName ? ` ${profile.name.middleName}` : ''
//         }`;

//         const userData = {
//           authType: AuthType.FACEBOOK,
//           authProviderId: profile.id,
//           email: profile.emails[0].value,
//           name: fullname,
//         };
//       }

//       const userDto = await user.toDto();
//       payload = {
//         message: `Login with Facebook success. Name: ${userDto.name}`,
//         user: userDto,
//         accessToken,
//       };
//       console.log(payload);
//       return done(null, accessToken);
//     } catch (error) {
//       done(error, false);
//     }
//   }
// }
