import { Injectable } from '@nestjs/common';
import { use } from 'passport';
import * as FacebookTokenStrategy from 'passport-facebook-token';

@Injectable()
export class FacebookStrategy {
  constructor() {
    this.init();
  }
  init() {
    use(
      new FacebookTokenStrategy(
        {
          clientID: process.env.APP_ID,
          clientSecret: process.env.APP_SECRET,
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: (err: any, user: any, info?: any) => void,
        ): Promise<any> => {
          const { emails, name } = profile;
          const userData = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
          };
          const payload = {
            userData,
            accessToken,
          };
          console.log('------->', payload);

          return done(null, payload);
        },
      ),
    );
  }
}
