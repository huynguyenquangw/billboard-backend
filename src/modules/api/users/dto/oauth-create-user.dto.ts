import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public authType: string;

  @IsString()
  public authProviderId: string;

  @IsEmail()
  public email: string;

  @IsString()
  public name: string;
}
