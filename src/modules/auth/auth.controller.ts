import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AuthType } from 'src/constants';
import { UsersService } from '../api/users/users.service';
import { LoginPayloadDto } from './dto/LoginPayload.dto';
import { LoginPayLoadDto } from './oauth/dto/loginPayload.dto';
import { FacebookService } from './oauth/services/facebook.service';

import { GoogleService } from './oauth/services/google.service';
// @ApiHeader({
//   name: 'X-MyHeader',
//   description: 'Custom header',
// })
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly facebookService: FacebookService,
    private readonly googleService: GoogleService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  @Post('login/social')
  async socialLogin(@Body() loginPayloadDto: LoginPayloadDto): Promise<any> {
    if (loginPayloadDto.type === AuthType.FACEBOOK) {
      const social_access_token = loginPayloadDto.social_access_token;
      this.facebookService.facebookLogin(social_access_token);
    } else if (loginPayloadDto.type === AuthType.GOOGLE) {
      // this.googleService
    }
  }

  /*
   * Oauth2
   * Google
   * Login handler
   */
  @Post('google/login')
  authenticate(@Body() loginPayLoadDto: LoginPayLoadDto) {
    const ticket = this.googleService.authenticate(loginPayLoadDto);
    return ticket;
  }
}
