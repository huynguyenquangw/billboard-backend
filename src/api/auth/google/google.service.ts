import { Injectable, UnauthorizedException } from '@nestjs/common';
//import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
//import { AuthenticationService } from '../authentication/authentication.service';
//import User from '../users/user.entity';
 
@Injectable()
export class GoogleService {
  oauthClient: Auth.OAuth2Client;
  private user =[];
  constructor(
    //private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    //private readonly authenticationService: AuthenticationService
  ) {
    const clientID = this.configService.get('GOOGLE_CLIENT_ID2');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET2');
 
    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret
    );
  }
  
  private upsert(array, item){
      const i = array.findIndex((_item) => _item.email ===item.email);
      if(i > -1) array[i]=item;
      else array.push(item);
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID2});
    
    const payload =tokenInfo.getPayload();
    this.upsert(this.user, payload);

    return payload; 
  }
}
