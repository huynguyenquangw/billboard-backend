import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillboardsService } from './billboards.service';
import { BillboardDto } from './dto/create-billboard.dto';

@Controller('api/billboards')
@ApiTags('billboards')
export class BillboardsController {
  constructor(private readonly billboardsService: BillboardsService) {}

  @Post('/create')
  billBoardCreate(@Body() billboardDto: BillboardDto): Promise<any> {
    return this.billboardsService.createbillBoard(billboardDto);
  }

  @Get('/getAll')
  billBoardGet(): Promise<any> {
    return this.billboardsService.getAll();
  }

  @Get('/getOne/:id')
  billBoardGetOne(@Param('id') getOneId: number): Promise<any> {
    return this.billboardsService.getOnebyId(getOneId);
  }

  @Patch('/update/:id')
  billBoardUpdate(
    @Param('id') updateId: number,
    @Body() billboardDto: BillboardDto,
  ): Promise<any> {
    return this.billboardsService.updateBillboard(updateId, billboardDto.name);
  }

  @Delete('/delete/:id')
  billBoardDelete(@Param('id') deleteId: number): Promise<any> {
    return this.billboardsService.deleteBillboard(deleteId);
  }
}
