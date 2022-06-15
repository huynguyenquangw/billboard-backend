import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FacebookModule } from './facebook/facebook.module';
import { GoogleModule } from './google/google.module';

@Module({
  imports: [GoogleModule, FacebookModule],
  controllers: [AuthController],
})
export class AuthModule {}
