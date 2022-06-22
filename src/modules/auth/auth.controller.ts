import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AuthType } from 'src/constants';
import { UsersService } from '../api/users/users.service';
import { LoginPayLoadDto } from './oauth/dto/login-payload.dto';
// import { LoginPayloadDto } from './dto/LoginPayload.dto';
// import { LoginPayLoadDto } from './oauth/dto/login-payload.dto';
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
  async socialLogin(@Body() loginPayloadDto: LoginPayLoadDto): Promise<any> {
    let ticket = {};
    if (loginPayloadDto.authType === AuthType.FACEBOOK) {
      const social_access_token = loginPayloadDto.token;
      ticket = this.facebookService.facebookLogin(social_access_token);
    } else if (loginPayloadDto.authType === AuthType.GOOGLE) {
      ticket = this.googleService.authenticate(loginPayloadDto);
    }
    console.log(ticket);
    return ticket;
  }

  // /*
  //  * Oauth2
  //  * Google
  //  * Login handler
  //  */
  // @Post('google/login')
  // authenticate(@Body() loginPayLoadDto: LoginPayLoadDto) {
  //   const ticket = this.googleService.authenticate(loginPayLoadDto);
  //   return ticket;
  // }
}
