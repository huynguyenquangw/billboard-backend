import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { GoogleService } from './oauth/services/google.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly googleService: GoogleService) {}

  /*
   * Oauth2
   * Facebook
   * Login handler
   */
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      payload: req.user,
    };
  }

  /*
   * Oauth2
   * Google
   * Login handler
   */
  @Post('google/login')
  authenticate(@Body('token') token: string) {
    const ticket = this.googleService.authenticate(token);
    return ticket;
  }
}
