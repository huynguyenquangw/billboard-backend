import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';

@Controller('auth/google')
@ApiTags('auth')
//@UseInterceptors(ClassSerializerInterceptor)
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post('login')
  authenticate(@Body('token') token: string) {
    const ticket = this.googleService.authenticate(token);
    return ticket;
  }
}
