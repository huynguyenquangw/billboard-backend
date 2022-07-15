import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
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

  //Reject a billboard
  @Get('/reject/:id')
  @ApiOperation({ summary: 'OPERATOR: reject 1 billboard' })
  billboardReject(@Param('id') rejectId: string): Promise<any> {
    return this.billboardsService.rejectBillboard(rejectId);
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
  @HttpCode(HttpStatus.OK)
  billBoardGet(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('address2') address2: CreateBillboardDto['address2'],
    @Query('rentalPrice') price: CreateBillboardDto['rentalPrice'],
    @Query('size_x') size_x: CreateBillboardDto['size_x'],
    @Query('size_y') size_y: CreateBillboardDto['size_y'],
    @Query('district') district: string,
  ):  Promise<PageDto<BillboardInfoDto>> {
    return this.billboardsService.search(
      pageOptionsDto,
      address2,
      price,
      size_x,
      size_y,
      district,
    );
  }

  //Get all non deleted billboard
  // @Get('/all')
  // @ApiOperation({ summary: 'Get all billboards' })
  // billboardGetAllWithoutDeleted(): Promise<Billboard[]> {
  //   return this.billboardsService.getAll();
  // }

  /**
   * Get billboard list by created time (default)
   * @returns billboard list with pagination
   */
  @Get('/all/approved')
  @ApiOperation({
    summary: 'Get all approved billboards for main page with pagination',
  })
  @HttpCode(HttpStatus.OK)
  async getApprovedBillboards(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.billboardsService.getApprovedBillboards(pageOptionsDto);
  }

  /**
   * Get billboard list price
   * @returns billboard list with pagination
   */
  @Get('all/approved/price')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all billboards filtered by price' })
  async getAllFilteredByPrice(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.billboardsService.getAllFilteredByPrice(pageOptionsDto);
  }

  /**
   * Get billboard list by circulation
   * @returns billboard list with pagination
   */
  @Get('all/approved/circulation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all billboards filtered by circulation' })
  async getAllFilteredByCirculation(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.billboardsService.getAllFilteredByCirculation(pageOptionsDto);
  }

  /**
   * TODO: update check current user
   * TODO: move it to useCase folder (billboardManagement) later on
   * CURRENT USER - OWNER
   * Get draft billboard list by created time (default)
   * @returns draft billboard list with pagination
   */
  @Get('/all/draft')
  @ApiOperation({
    summary: 'Get all draft billboards of current user with pagination',
  })
  @HttpCode(HttpStatus.OK)
  async getDraftBillboards(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.billboardsService.getDraftBillboards(pageOptionsDto);
  }

  /**
   * TODO: update check current user
   * TODO: move it to useCase folder (billboardManagement) later on
   * CURRENT USER - OWNER
   * Get rented billboard list by created time (default)
   * @returns rented billboard list with pagination
   */
  @Get('/all/pending')
  @ApiOperation({
    summary: 'Get all pending billboards of current user with pagination',
  })
  @HttpCode(HttpStatus.OK)
  async getPendingBillboards(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.billboardsService.getPendingBillboards(pageOptionsDto);
  }

  /**
   * TODO: update check current user
   * TODO: move it to useCase folder (billboardManagement) later on
   * CURRENT USER - OWNER
   * Get rented billboard list by created time (default)
   * @returns rented billboard list with pagination
   */
  @Get('/all/rented')
  @ApiOperation({
    summary: 'Get all rented billboards of current user with pagination',
  })
  @HttpCode(HttpStatus.OK)
  async getRentedBillboards(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.billboardsService.getRentedBillboards(pageOptionsDto);
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
  @Patch(':id/update')
  @ApiOperation({ summary: 'Update 1 billboard info' })
  update(
    @Param('id') id: string,
    @Body() body: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    return this.billboardsService.update(id, body);
  }

  //Soft Delete a billobard
  @Get(':id/delete')
  billBoardSoftDelete(@Param('id') softDeleteId: string): Promise<any> {
    return this.billboardsService.softDeleteBillboard(softDeleteId);
  }

  //Restore a soft deleted billboard
  @Get(':id/restore')
  billboardRestore(@Param('id') restoreId: string): Promise<any> {
    return this.billboardsService.restoreSoftDeleteBillboard(restoreId);
  }

  //Completely delete a billboard from database
  // @Delete('/delete/:id')
  // billBoardHardDelete(@Param('id') hardDeleteId: string): Promise<any> {
  //   return this.billboardsService.hardDeleteBillboard(hardDeleteId);
  // }
}
