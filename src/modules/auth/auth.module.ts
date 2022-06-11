import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleModule } from './google/google.module';

@Module({
  imports: [GoogleModule],
  controllers: [AuthController],
})
export class AuthModule {}
