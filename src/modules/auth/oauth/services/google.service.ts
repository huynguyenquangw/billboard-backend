import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, google } from 'googleapis';
import { sign } from 'jsonwebtoken';
import { UserEntity } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';
import { LoginPayLoadDto } from '../dto/login-payload.dto';
@Injectable()
export class GoogleService {
  oauthClient: Auth.OAuth2Client; //Create an oauth2 client
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>, // Inject Repository 'users' in to this service file
    private readonly configService: ConfigService, //Create a configService to call all the .env file
  ) {
    const clientID = this.configService.get('GOOGLE_CLIENT_ID2');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET2');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret); //Connect that client into our Google API server
  }

  //Main function to decryt the accessToken from Web SPA and generate a new accessToken for our server
  async authenticate(loginPayload: LoginPayLoadDto): Promise<any> {
    const tokenInfo = await this.oauthClient.getTokenInfo(loginPayload.token); // Decryt the accessToken

    const findUser = await this.userRepo.findOne({
      where: { email: tokenInfo.email, authType: loginPayload.authType },
    }); //Find the user in our database that has the same email as the decryted accessToken email

    if (!findUser) {
      const newUser = this.userRepo.create({
        name: loginPayload.name,
        email: loginPayload.email,
        authType: loginPayload.authType,
      });
      await this.userRepo.save(newUser); // Save the new user to the database before grant it a new accessToken

      return {
        status: { code: 200, message: 'SUCCESS' },
        data: {
          access_token: sign(
            {
              userId: newUser.id,
            },
            process.env.GOOGLE_CLIENT_SECRET2,
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
          process.env.GOOGLE_CLIENT_SECRET2,
        ),
      },
    };
  }
}
