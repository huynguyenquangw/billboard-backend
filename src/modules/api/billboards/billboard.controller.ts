import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillboardService } from './billboard.service';
import { BillboardDto } from './dto/create-billboard.dto';

@Controller('api/billboards')
@ApiTags('billboards')
export class BillboardController {
    constructor(private readonly billboardService: BillboardService){}

    @Post('/create')
    billBoardCreate(@Body() billboardDto: BillboardDto): Promise<any>{
        return this.billboardService.createbillBoard(billboardDto);
        
    }

    @Get('/getAll')
    billBoardGet(): Promise<any>{
        return this.billboardService.getAll();

    }
    
    @Get('/getOne/:id')
    billBoardGetOne(@Param('id') getOneId: number): Promise<any>{
        return this.billboardService.getOnebyId(getOneId);

    }

    @Patch('/update/:id')
    billBoardUpdate(
        @Param('id') updateId: number,
        @Body() billboardDto: BillboardDto,
        ): Promise<any>{
        return this.billboardService.updateBillboard(updateId, billboardDto.name);

    }

    @Delete('/delete/:id')
    billBoardDelete(@Param('id') deleteId: number): Promise<any>{
        return this.billboardService.deleteBillboard(deleteId);

    }
}
