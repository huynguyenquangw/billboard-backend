'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractDto } from 'src/common/dto/AbstractDto';
import { AuthType } from 'src/constants';
import { Ward } from '../../address/ward.entity';

import { User } from '../user.entity';

export class UserInfoDto extends AbstractDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address2: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({ enum: AuthType })
  @IsNotEmpty()
  authType: AuthType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authProviderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Ward)
  ward: Ward;

  constructor(user: User) {
    super(user);
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.address = user.address;
    this.address2 = user.address2;
    this.avatar = user.avatar;
    this.authType = user.authType;
    this.authProviderId = user.authProviderId;
    this.ward = user.ward;
  }
}
