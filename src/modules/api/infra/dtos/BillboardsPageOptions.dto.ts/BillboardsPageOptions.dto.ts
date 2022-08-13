import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { BillboardSortMode } from 'src/constants/billboard-sort-mode';

export class BillboardsPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    default: BillboardSortMode.DEFAULT,
  })
  @IsOptional()
  readonly sortMode?: BillboardSortMode = BillboardSortMode.DEFAULT;
}
