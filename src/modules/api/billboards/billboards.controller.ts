import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillboardsService } from './billboards.service';
import { BillboardInfoDto } from './dto/billboard-info.dto';
import { CreateBillboardDto } from './dto/create-billboard.dto';

@Controller('api/billboards')
@ApiTags('Billboards')
export class BillboardsController {
  constructor(private readonly billboardsService: BillboardsService) {}

  // Create a new billboard
  @Post('create')
  @ApiOperation({ summary: 'Create 1 billboard' })
  billBoardCreate(
    @Body() createBillboardDto: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    // return this.billboardsService.createbillBoard(createBillboardDto);
    return this.billboardsService.create(createBillboardDto);
  }

  //Search and get all billbaord by address2
  @Get('/getAll/:address2')
  billBoardGet(
    @Param('address2') address2: CreateBillboardDto['address2'],
  ): Promise<any> {
    return this.billboardsService.getAllbyAddress2(address2);
  }

  //Get one billboard by id for detail page
  @Get('/getOne/:id')
  @ApiOperation({ summary: 'Get 1 billboard' })
  billBoardGetOne(@Param('id') getOneId: string): Promise<any> {
    return this.billboardsService.getOneById(getOneId);
  }

  //Get all billboard that has been approved
  @Get('/approved')
  @ApiOperation({ summary: 'Get all approved billboards for main page' })
  billboardGetAllApproved(): Promise<any> {
    return this.billboardsService.getAllApproved();
  }

  //Approve a billboard
  @Get('/approve/:id')
  @ApiOperation({ summary: 'OPERATOR: approve 1 billboard' })
  billboardApprove(@Param('id') approveId: string): Promise<any> {
    return this.billboardsService.approveBillboard(approveId);
  }

  //Get all billboard
  @Get('/admin/getAll')
  billboardGetAllWithDeleted(): Promise<any> {
    return this.billboardsService.getAllWithDeleted();
  }

  //Get all non deleted billboard
  @Get('/getAll')
  @ApiOperation({ summary: 'Get all billboards' })
  billboardGetAllWithoutDeleted(): Promise<any> {
    return this.billboardsService.getAll();
  }

  /**
   * ROLE: USER
   * Update billboard
   */
  @Patch(':id/update')
  @ApiOperation({ summary: 'Update 1 billboard info' })
  update(
    @Param('id') id: string,
    @Body() body: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    return this.billboardsService.update(id, body);
  }

  //Soft Delete a billobard
  @Get('/softDelete/:id')
  billBoardSoftDelete(@Param('id') softDeleteId: string): Promise<any> {
    return this.billboardsService.softDeleteBillboard(softDeleteId);
  }

  //Restore a soft deleted billboard
  @Get('restore/:id')
  billboardRestore(@Param('id') restoreId: string): Promise<any> {
    return this.billboardsService.restoreSoftDeleteBillboard(restoreId);
  }

  //Completely delete a billboard from database
  @Delete('/delete/:id')
  billBoardHardDelete(@Param('id') hardDeleteId: string): Promise<any> {
    return this.billboardsService.hardDeleteBillboard(hardDeleteId);
  }
}
