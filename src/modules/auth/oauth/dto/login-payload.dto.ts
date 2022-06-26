import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthType } from 'src/constants';

export class LoginPayLoadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly auth_type: AuthType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly social_access_token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly user_name: string;
}
