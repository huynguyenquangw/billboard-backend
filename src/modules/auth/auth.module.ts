import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../api/users/user.entity';
import { UsersModule } from '../api/users/users.module';
import { AuthController } from './auth.controller';
import { FacebookService } from './oauth/services/facebook.service';
import { GoogleService } from './oauth/services/google.service';
// import { GoogleModule } from './google/google.module';
import { JwtStrategy } from './oauth/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule,
    HttpModule,
    UsersModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [GoogleService, FacebookService, JwtStrategy],
})
export class AuthModule {}
