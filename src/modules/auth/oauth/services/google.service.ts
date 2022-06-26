import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, google } from 'googleapis';
import { sign } from 'jsonwebtoken';
import { AuthType } from 'src/constants';
import { UserEntity } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';
import { LoginPayLoadDto } from '../dto/login-payload.dto';

@Injectable()
export class GoogleService {
  oauthClient: Auth.OAuth2Client; //Create an oauth2 client
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>, // Inject Repository 'users' in to this service file
    private readonly configService: ConfigService, //Create a configService to call all the .env file
  ) {
    const clientID = this.configService.get('GOOGLE_CLIENT_ID2');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET2');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret); //Connect that client into our Google API server
  }

  //Main function to decryt the accessToken from Web SPA and generate a new accessToken for our server
  async authenticate(loginPayload: LoginPayLoadDto): Promise<any> {
    //Decryt the accessToken using Google People Api
    const userProfile = await this.httpService.get(`https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos&access_token=${loginPayload.token}`).toPromise();

    console.log('data: ', userProfile.data)
    const findUser = await this.userRepo.findOne({
      where: { email: loginPayload.user_name, authType: loginPayload.authType },
    }); //Find the user in our database that has the same email as the decryted accessToken email

    if (!findUser) {
      const newUser = this.userRepo.create({
        name: userProfile.data.names[0].displayName,
        email: userProfile.data.emailAddresses[0].value,
        authType: AuthType.GOOGLE,
        authProviderId: userProfile.data.names[0].metadata.source.id,
        avatar: userProfile.data.photos[0].url,
      });
      await this.userRepo.save(newUser); // Save the new user to the database before grant it a new accessToken

      return {
        status: { code: 200, message: 'SUCCESS' },
        data: {
          access_token: sign(
            {
              userId: newUser.id,
            },
            process.env.SOFTDEV_BILLBOARD_SECRET,
          ),
        },
      };
    }

    return {
      status: { code: 200, message: 'SUCCESS' },
      data: {
        access_token: sign(
          {
            userId: findUser.id,
          },
          process.env.SOFTDEV_BILLBOARD_SECRET,
        ),
      },
    };
  }
}
