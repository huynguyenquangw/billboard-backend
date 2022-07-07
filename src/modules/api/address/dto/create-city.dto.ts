import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly abbreviation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly photoUrl?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly lat?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly long?: number;
}
