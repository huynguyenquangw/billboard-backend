import { Module } from '@nestjs/common';
import { UsersModule } from '../api/users/users.module';
import { AuthController } from './auth.controller';
import { GoogleModule } from './google/google.module';
import { FacebookStrategy } from './oauth/strategies/facebook.strategy';

@Module({
  imports: [UsersModule, GoogleModule],
  controllers: [AuthController],
  providers: [FacebookStrategy],
})
export class AuthModule {}
