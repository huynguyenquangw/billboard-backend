import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly phone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address2: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  readonly wardId: string;
}
