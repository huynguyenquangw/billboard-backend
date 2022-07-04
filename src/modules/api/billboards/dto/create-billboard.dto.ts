import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { StatusType } from 'src/constants';

export class BillboardDto {
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty()
  // userId: string;

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty()
  // districtId: number;

  @IsString()
  address: string;

  @IsString()
  address2: string;

  @IsString()
  name: string;

  @IsArray()
  picture: string[];

  @IsString()
  video: string;

  @IsNumber()
  size_x: number;

  @IsNumber()
  size_y: number;

  @IsNumber()
  circulation: number;

  @IsString()
  previousClient: string;

  @IsNumber()
  rentalPrice: number;

  @IsString()
  rentalDuration: string;

  @IsString()
  description: string;

  @IsEnum(StatusType)
  status: StatusType;
}
