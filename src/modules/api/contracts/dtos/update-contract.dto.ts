import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateContractDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly tenantName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly note: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  readonly startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  readonly endDate: Date;
}
