import { Module } from '@nestjs/common';
import { FacebookStrategy } from 'src/core/global/facebook.strategy';
import { UsersModule } from 'src/modules/api/users/users.module';

import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';

@Module({
  imports: [UsersModule],
  controllers: [FacebookController],
  providers: [FacebookService, FacebookStrategy],
})
export class FacebookModule {}
