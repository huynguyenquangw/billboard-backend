import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthType } from 'src/constants';

export class OauthCreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly authType: AuthType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly authProviderId: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  readonly avatar: string;
}
