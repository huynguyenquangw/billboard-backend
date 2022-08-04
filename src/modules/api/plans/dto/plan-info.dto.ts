import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  @IsString()
  @IsOptional()
  description: string;
}
