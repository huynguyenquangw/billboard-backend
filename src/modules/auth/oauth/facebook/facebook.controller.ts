import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('auth')
@ApiTags('auth')
export class FacebookController {
  // private readonly FRONT_URL = process.env.FRONT_URL;
  // constructor(private readonly facebookService: FacebookService) {}
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    console.log(req.user);

    return {
      statusCode: HttpStatus.OK,
      payload: req.user,
    };
  }

  // @Post('')
  // @UseGuards(AuthGuard('facebook'))
  // async facebookAuth(@Req() req, @Res() res, @Next() next) {
  //   console.log('Facebook Auth: ', req.user);
  //   console.log('Facebook Auth: ', res);
  // }
}
