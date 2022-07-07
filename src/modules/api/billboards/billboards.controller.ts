import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwtAuth.guard';
import { Billboard } from './billboard.entity';
import { BillboardsService } from './billboards.service';
import { BillboardInfoDto } from './dto/billboard-info.dto';
import { CreateBillboardDto } from './dto/create-billboard.dto';

@Controller('api/billboards')
@ApiTags('Billboards')
export class BillboardsController {
  constructor(private readonly billboardsService: BillboardsService) {}

  //Get all billboard
  @Get('/admin/all')
  @ApiOperation({ summary: 'ADMIN: Get all billboards, include deleted' })
  billboardGetAllWithDeleted(): Promise<any> {
    return this.billboardsService.getAllWithDeleted();
  }

  //Approve a billboard
  @Get('/approve/:id')
  @ApiOperation({ summary: 'OPERATOR: approve 1 billboard' })
  billboardApprove(@Param('id') approveId: string): Promise<any> {
    return this.billboardsService.approveBillboard(approveId);
  }

  // Create a new billboard
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create billboard' })
  async billBoardCreate(
    @Req() req,
    @Body() createBillboardDto: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    const newBillboard: Billboard = await this.billboardsService.create(
      req.user.id,
      createBillboardDto,
    );
    return newBillboard.toDto();
  }

  //Search and get all billbaord by address2
  @Get('search')
  @ApiOperation({ summary: 'Search billboards' })
  billBoardGet(
    @Query('address2') address2: CreateBillboardDto['address2'],
    @Query('rentalPrice') price: CreateBillboardDto['rentalPrice'],
    @Query('size_x') size_x: CreateBillboardDto['size_x'],
    @Query('size_y') size_y: CreateBillboardDto['size_y'],
    @Query('district') district: string,
  ): Promise<any> {
    return this.billboardsService.search(address2, price, size_x, size_y, district);
  }

  //Get all billboard that has been approved
  @Get('/all/approved')
  @ApiOperation({ summary: 'Get all approved billboards for main page' })
  billboardGetAllApproved(): Promise<any> {
    return this.billboardsService.getAllApproved();
  }

  //Get all non deleted billboard
  @Get('/all')
  @ApiOperation({ summary: 'Get all billboards' })
  billboardGetAllWithoutDeleted(): Promise<any> {
    return this.billboardsService.getAll();
  }

  //Get one billboard by id for detail page
  @Get('/:id')
  @ApiOperation({ summary: 'Get 1 billboard' })
  billBoardGetOne(@Param('id') getOneId: string): Promise<any> {
    return this.billboardsService.getOneById(getOneId);
  }

  /**
   * ROLE: USER
   * Update billboard
   */
  @Patch('update/:id')
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
