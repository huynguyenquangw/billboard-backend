import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/plans')
@ApiTags('plans')
export class PlansController {}
