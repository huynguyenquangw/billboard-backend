import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('billboards')
@ApiTags('billboards')
export class BillboardsController {}
