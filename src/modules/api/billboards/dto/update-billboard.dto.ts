import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsLatitude,
  IsLongitude,
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

  @IsArray()
  @IsOptional()
  previousClientIds: string[];

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
  @Type(() => Number)
  @IsOptional()
  size_x: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  size_y: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  circulation: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  rentalPrice: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  rentalDuration: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsLatitude()
  @IsOptional()
  lat: number;

  @IsLongitude()
  @IsOptional()
  long: number;
}
