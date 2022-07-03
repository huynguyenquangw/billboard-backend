import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillboardsService } from './billboards.service';
import { BillboardDto } from './dto/create-billboard.dto';

@Controller('api/billboards')
@ApiTags()
export class BillboardsController {
  constructor(private readonly billboardsService: BillboardsService) {}

  @Post('/create')
  billBoardCreate(@Body() billboardDto: BillboardDto): Promise<any> {
    return this.billboardsService.createbillBoard(billboardDto);
  }

  @Get('/getAll/:address2')
  billBoardGet(@Param('address2') address2: BillboardDto['address2'] ): Promise<any> {
    return this.billboardsService.getAllbyAddress2(address2);
  }

  @Get('/getOne/:id')
  billBoardGetOne(@Param('id') getOneId: string): Promise<any> {
    return this.billboardsService.getOnebyId(getOneId);
  }

  @Get('/getAll')
  billboardGetAll(): Promise<any> {
    return this.billboardsService.getAll();
  }

  @Patch('/update/:id')
  billBoardUpdate(
    @Param('id') updateId: string,
    @Body() billboardDto: BillboardDto['name'],
  ): Promise<any> {
    return this.billboardsService.updateBillboard(updateId, billboardDto);
  }

  @Patch('/softDelete/:id')
  billBoardSoftDelete(
    @Param('id') softDeleteId: string,
  ): Promise<any> {
    return this.billboardsService.softDeleteBillboard(softDeleteId);
  }

  @Delete('/delete/:id')
  billBoardHardDelete(@Param('id') hardDeleteId: string): Promise<any> {
    return this.billboardsService.hardDeleteBillboard(hardDeleteId);
  }
}
