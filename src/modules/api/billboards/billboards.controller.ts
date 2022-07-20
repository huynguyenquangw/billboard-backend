import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import RolesGuard from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
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

  // Create a new billboard
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    return this.billboardsService.search(
      address2,
      price,
      size_x,
      size_y,
      district,
    );
  }

  /**
   * Get billboard count by district
   * @returns district and billboard count
   */
  // @Get('all/approved/byDistrict')
  // @ApiOperation({ summary: 'Get billboard count by district' })
  // getApprovedBillboardsWithinDistrict(): Promise<any> {
  //   return this.billboardsService.getApprovedBillboardsWithinDistrict();
  // }

  //

  /**
   * ROLE: USER
   * Update billboard
   */
  @Get(':id')
  @ApiOperation({ summary: 'Update 1 billboard info' })
  async getOne(@Param('id') id: string): Promise<BillboardInfoDto> {
    return this.billboardsService.findOneWithRelations(id);
  }

  /**
   * ROLE: USER
   * Update billboard
   */
  @Patch(':id/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update 1 billboard info' })
  update(
    @Param('id') id: string,
    @Body() body: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    return this.billboardsService.update(id, body);
  }
}
