import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthType } from 'src/constants';

export class LoginPayLoadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly authType: AuthType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly token: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly name?: string;
}
