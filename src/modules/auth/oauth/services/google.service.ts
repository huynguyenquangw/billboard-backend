import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, google } from 'googleapis';
import { UserEntity } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { LoginPayLoadDto } from '../dto/loginPayload.dto';
@Injectable()
export class GoogleService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {
    const clientID = this.configService.get('GOOGLE_CLIENT_ID2');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET2');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(loginPayload: LoginPayLoadDto): Promise<{status: number, message: string , accessToken: string}> {
    const tokenInfo = await this.oauthClient.getTokenInfo(loginPayload.token);

    const findUser = await this.userRepo.findOne({where:{email: tokenInfo.email}})

    if(findUser) {
      return {
        status: 200,
        message: 'SUCESS',
        accessToken: sign(
        {
          userId: findUser.id,
        },
        process.env.GOOGLE_CLIENT_SECRET2,
      )};
    } else{
      const newUser = this.userRepo.create({name: loginPayload.name, email: loginPayload.email, authType: loginPayload.authType});
      this.userRepo.save(newUser);

      return {
        status: 200,
        message: 'SUCCESS',
        accessToken: sign(
        {
          userId: newUser.id,
        },
        process.env.GOOGLE_CLIENT_SECRET2,
      )};
    }
  }
}
