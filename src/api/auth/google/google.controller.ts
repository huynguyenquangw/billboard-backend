import {
    Controller,
    Post,
    ClassSerializerInterceptor,
    UseInterceptors,
    Body,
    Req,
    Res,
} from '@nestjs/common';
//import { Request, Response } from 'express';
import { GoogleService } from './google.service';

@Controller('google')
//@UseInterceptors(ClassSerializerInterceptor)
export class GoogleController {
    constructor(
        private readonly googleService: GoogleService
    ) {
    }

    @Post('login')
    authenticate(
        @Body('token') token: string,
    ) {
        const ticket = this.googleService.authenticate(token);
        return ticket
    }
}
