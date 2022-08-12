import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PreviousClient } from '../previousClients.entity';

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

  // @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PreviousClient)
  previousClient: object[];

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
