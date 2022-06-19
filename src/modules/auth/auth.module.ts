import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../api/users/user.entity';
import { UsersModule } from '../api/users/users.module';
import { AuthController } from './auth.controller';
import { GoogleService } from './oauth/services/google.service';
// import { GoogleModule } from './google/google.module';
import { FacebookStrategy } from './oauth/strategies/facebook.strategy';
import { JwtStrategy } from './oauth/strategies/jwt.strategy';

@Module({
  imports: [JwtModule,UsersModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [FacebookStrategy,JwtStrategy, GoogleService],
})
export class AuthModule {}
