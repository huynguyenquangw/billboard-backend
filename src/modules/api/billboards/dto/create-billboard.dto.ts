import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBillboardDto {
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty()
  // ownerId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly wardId: string;

  @IsString()
  address: string;

  @IsString()
  address2: string;

  @IsString()
  name: string;

  @IsArray()
  picture: object[];

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
}
