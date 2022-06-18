import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, google } from 'googleapis';
import { UserEntity } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';

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

  async upsert(item) {
    const i = await this.userRepo.findOne({ where: { email: item.email } });
    if (i === null) {
      const newUser = this.userRepo.create({
        name: item.given_name,
        email: item.email,
      });
      this.userRepo.save(newUser);
    }
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID2,
    });

    const payload = tokenInfo.getPayload();
    this.upsert(payload);

    return payload;
  }
}
