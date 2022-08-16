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

export class CreateBillboardDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  readonly wardId: string;

  @IsArray()
  // @Transform(({ previousClientIds }) => JSON.parse(previousClientIds))
  @IsOptional()
  // // @ValidateNested({ each: true })
  // // @Type(() => PreviousClient)
  previousClientIds: string[];

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  address2: string;

  @IsString()
  // @IsNotEmpty()
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
