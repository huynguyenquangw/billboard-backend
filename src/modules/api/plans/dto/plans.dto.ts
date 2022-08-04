import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class PlanDto {
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
  post_limit: number;

  @IsBoolean()
  @IsOptional()

  @IsString()
  @IsOptional()
  description: string;
}

