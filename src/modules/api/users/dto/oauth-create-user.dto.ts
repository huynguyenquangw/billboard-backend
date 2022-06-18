import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OauthCreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly authType: string;

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
}
