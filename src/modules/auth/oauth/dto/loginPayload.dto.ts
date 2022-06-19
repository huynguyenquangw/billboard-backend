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

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
}
