'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from 'src/common/dto/AbstractDto';
import { AuthType } from 'src/constants';

import { UserEntity } from '../user.entity';

export class UserDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  address: string;

  @ApiPropertyOptional()
  address2: string;

  @ApiPropertyOptional()
  avatar: string;

  @ApiPropertyOptional({ enum: AuthType })
  authType: AuthType;

  @ApiPropertyOptional()
  authProviderId: string;

  constructor(user: UserEntity) {
    super(user);
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.address = user.address;
    this.address2 = user.address2;
    this.avatar = user.avatar;
    this.authType = user.authType;
    this.authProviderId = user.authProviderId;
  }
}
