import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { BillboardFilterMode } from 'src/constants/billboard-filter-mode';

export class BillboardsPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    default: BillboardFilterMode.DEFAULT,
  })
  @IsOptional()
  readonly filterMode?: BillboardFilterMode = BillboardFilterMode.DEFAULT;
}
