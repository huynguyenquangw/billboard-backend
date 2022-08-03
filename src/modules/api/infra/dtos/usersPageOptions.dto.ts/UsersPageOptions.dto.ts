import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { UserFilterMode } from 'src/constants';

export class UsersPageOptionsDto extends PageOptionsDto {
  //   @ApiPropertyOptional({
  //     default: FilterMode.DEFAULT,
  //   })
  //   @IsOptional()
  //   readonly filterMode?: FilterMode = FilterMode.DEFAULT;

  @ApiPropertyOptional({
    default: UserFilterMode.DEFAULT,
  })
  @IsOptional()
  readonly filterMode?: UserFilterMode = UserFilterMode.DEFAULT;
}
