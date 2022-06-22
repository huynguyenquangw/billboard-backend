import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthType } from 'src/constants';

export class LoginPayloadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly type: AuthType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly social_access_token: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  readonly user_name: string;
}
