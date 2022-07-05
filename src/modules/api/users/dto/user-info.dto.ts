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
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly phone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address2: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly avatar: string;

  @ApiProperty({ enum: AuthType })
  @IsNotEmpty()
  readonly authType: AuthType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly authProviderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Ward)
  readonly ward: Ward;

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
