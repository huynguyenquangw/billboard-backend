import { Module } from '@nestjs/common';
// import { FacebookStrategy } from './facebook/facebook.strategy';
import { AuthController } from './auth.controller';

@Module({
  //   providers: [FacebookStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
