import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/api/users/user.entity';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class GoogleModule {}
