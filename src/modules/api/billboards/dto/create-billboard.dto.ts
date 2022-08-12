import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

  @IsArray()
  @IsOptional()
  previousClient: object[]; //{id, client_name, client_logo} taken from PreviousClient enitity

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  rentalPrice: number;

  @IsString()
  @IsOptional()
  rentalDuration: string;

  @IsString()
  @IsOptional()
  description: string;
}
