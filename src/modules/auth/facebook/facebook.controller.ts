import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { FacebookService } from './facebook.service';

@Controller('auth/facebook')
@ApiTags('auth')
export class FacebookController {
  private readonly FRONT_URL = process.env.FRONT_URL;
  constructor(private readonly facebookService: FacebookService) {}

  // @Get()
  // getHello(): string {
  //   return this.facebookService.getHello();
  // }

  @Get('')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    console.log('login success');

    // return HttpStatus.OK;
  }

  @Get('/callback')
  @UseGuards(AuthGuard('facebook'))
  @Redirect('', 302)
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    // console.log(req);

    // return {
    //   statusCode: HttpStatus.OK,
    //   // data: req,
    // };
    return { url: `${this.FRONT_URL}` };
  }
}
