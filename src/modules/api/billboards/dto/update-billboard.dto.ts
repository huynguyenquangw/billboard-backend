import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateBillboardDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  readonly wardId: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  address2: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  video: string;

  @IsNumber()
  @IsOptional()
  size_x: number;

  @IsNumber()
  @IsOptional()
  size_y: number;

  @IsNumber()
  @IsOptional()
  circulation: number;

  @IsArray()
  @IsOptional()
  previousClient: object[];

  @IsNumber()
  @IsOptional()
  rentalPrice: number;

  @IsString()
  @IsOptional()
  rentalDuration: string;

  @IsString()
  @IsOptional()
  description: string;
}
