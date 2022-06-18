import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../api/users/user.entity';
import { UsersModule } from '../api/users/users.module';
import { AuthController } from './auth.controller';
import { GoogleService } from './oauth/services/google.service';
// import { GoogleModule } from './google/google.module';
import { FacebookStrategy } from './oauth/strategies/facebook.strategy';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [FacebookStrategy, GoogleService],
})
export class AuthModule {}
