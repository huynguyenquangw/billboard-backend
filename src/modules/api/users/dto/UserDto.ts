'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from 'src/common/dto/AbstractDto';
import { RoleType } from 'src/constants';

import { UserEntity } from '../user.entity';

export class UserDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  authProviderId: string;

  @ApiPropertyOptional()
  avatar: string;

  @ApiPropertyOptional({ enum: RoleType })
  role: RoleType;

  constructor(user: UserEntity) {
    super(user);
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.authProviderId = user.authProviderId;
    this.avatar = user.avatar;
    this.role = user.role;
  }
}
