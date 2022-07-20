import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBillboardDto {
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
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  picture: object[];

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

  @IsString()
  @IsOptional()
  previousClient: string;

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
