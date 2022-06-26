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
    if (loginPayloadDto.auth_type === AuthType.FACEBOOK) {
      ticket = this.facebookService.facebookLogin(loginPayloadDto);
    } else if (loginPayloadDto.auth_type === AuthType.GOOGLE) {
      ticket = this.googleService.authenticate(loginPayloadDto);
    }
    console.log(ticket);
    return ticket;
  }
}
