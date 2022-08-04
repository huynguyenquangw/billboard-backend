import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StatusType } from 'src/constants';

export class PlanInfoDto {
  // @ApiProperty()
  // @IsUUID()
  // @IsOptional()
  // readonly subscriptionId: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  duration: number;

  @IsNumber()
  @IsOptional()
  postLimit: number;

  @IsEnum(StatusType)
  @IsOptional()
  status: StatusType;

  @IsString()
  @IsOptional()
  description: string;
}
