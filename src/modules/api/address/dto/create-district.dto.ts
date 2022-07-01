import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly abbreviation: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly zip?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly photo?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  readonly cityId: string;
}
