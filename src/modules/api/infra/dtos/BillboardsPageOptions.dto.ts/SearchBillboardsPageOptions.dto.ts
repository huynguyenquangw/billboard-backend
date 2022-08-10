import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { BillboardFilterMode } from 'src/constants';
import { BillboardSortMode } from 'src/constants/billboard-sort-mode';
import { BillboardsPageOptionsDto } from './BillboardsPageOptions.dto';

export class SearchBillboardsPageOptionsDto extends BillboardsPageOptionsDto {
  @ApiPropertyOptional({
    default: 'null',
  })
  @IsOptional()
  readonly district?: string; // district id

  @ApiPropertyOptional({
    default: BillboardSortMode.DEFAULT,
  })
  @IsOptional()
  readonly sortMode?: BillboardSortMode = BillboardSortMode.DEFAULT;

  @ApiPropertyOptional({
    default: BillboardFilterMode.DEFAULT,
  })
  @IsOptional()
  readonly filterMode?: BillboardFilterMode = BillboardFilterMode.DEFAULT;
}
