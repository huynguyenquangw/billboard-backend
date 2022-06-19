import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UsersService } from '../api/users/users.service';
import { LoginPayLoadDto } from './oauth/dto/loginPayload.dto';
import { GoogleService } from './oauth/services/google.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  CLIENT_HOME_PAGE_URL = 'http://localhost:3000';

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
  @Redirect()
  async facebookLoginRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    // const jwt = this.userService.createJwtPayload(req.user.user);
    const accessToken = req.user;
    // res.redirect;
    // console.log('req: ', req.user);
    // console.log('res: ', res);

    // const result = {
    //   statusCode: HttpStatus.OK,
    //   payload: req.user,
    // };
    res.redirect(
      `${this.CLIENT_HOME_PAGE_URL}/?access_token=${accessToken}`,
      // `${this.CLIENT_HOME_PAGE_URL}`,
    );
    return accessToken;
  }

  // // when login is successful, retrieve user info
  // @Get('login/success')
  // loginSuccess(@Req() req: Request, @Res() res: Response) {
  //   if (req.user) {
  //     res.json({
  //       success: true,
  //       message: 'User has successfully authenticated',
  //       user: req.user,
  //       cookies: req.cookies,
  //     });
  //   }
  // }

  // // when login failed, send failed msg
  // @Get('login/failed')
  // loginFailed(@Req() req: Request, @Res() res: Response) {
  //   res.status(401).json({
  //     success: false,
  //     message: 'user failed to authenticate.',
  //   });
  // }

  // // When logout, redirect to client
  // @Get('logout')
  // logout(@Req() req: Request, @Res() res: Response) {
  //   req.logout();
  //   res.redirect(this.CLIENT_HOME_PAGE_URL);
  // }

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
