import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthType } from 'src/constants';
import { UsersService } from '../api/users/users.service';
import { LoginPayLoadDto } from './oauth/dto/login-payload.dto';
import { FacebookService } from './oauth/services/facebook.service';

import { GoogleService } from './oauth/services/google.service';
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
  @ApiOperation({ summary: 'Login' })
  async socialLogin(@Body() loginPayloadDto: LoginPayLoadDto): Promise<any> {
    try {
      if (loginPayloadDto.auth_type === AuthType.FACEBOOK) {
        return await this.facebookService.facebookLogin(loginPayloadDto);
      } else if (loginPayloadDto.auth_type === AuthType.GOOGLE) {
        return await this.googleService.authenticate(loginPayloadDto);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
