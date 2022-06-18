import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillboardsService } from './billboards.service';

@Controller('api/billboards')
@ApiTags()
export class BillboardsController {
  constructor(private readonly billboardsService: BillboardsService) {}

  // @Post('/create')
  // billBoardCreate(@Body() billboardDto: BillboardDto): Promise<any> {
  //   return this.billboardsService.createbillBoard(billboardDto);
  // }

  // @Get('/getAll')
  // billBoardGet(): Promise<any> {
  //   return this.billboardsService.getAll();
  // }

  // @Get('/getOne/:id')
  // billBoardGetOne(@Param('id') getOneId: number): Promise<any> {
  //   return this.billboardsService.getOnebyId(getOneId);
  // }

  // @Get('/getFour/:id1/:id2/:id3/:id4')
  // billboardGetFour(
  //   @Param('id1') id1: number,
  //   @Param('id2') id2: number,
  //   @Param('id3') id3: number,
  //   @Param('id4') id4: number,
  // ): Promise<any> {
  //   return this.billboardsService.getFourbyId(id1, id2, id3, id4);
  // }

  // @Patch('/update/:id')
  // billBoardUpdate(
  //   @Param('id') updateId: number,
  //   @Body() billboardDto: BillboardDto,
  // ): Promise<any> {
  //   return this.billboardsService.updateBillboard(updateId, billboardDto.name);
  // }

  // @Delete('/delete/:id')
  // billBoardDelete(@Param('id') deleteId: number): Promise<any> {
  //   return this.billboardsService.deleteBillboard(deleteId);
  // }
}
