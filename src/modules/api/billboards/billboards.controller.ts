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
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
// import RolesGuard from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { UpdateResult } from 'typeorm';
import { Billboard } from './billboard.entity';
import { BillboardsService } from './billboards.service';
import { BillboardInfoDto } from './dto/billboard-info.dto';
import { CreateBillboardDto } from './dto/create-billboard.dto';

@Controller('api/billboards')
@ApiTags('Billboards')
export class BillboardsController {
  constructor(private readonly billboardsService: BillboardsService) {}

  /**
   * Create a new billboard
   * @param req
   * @param createBillboardDto
   * @returns BillboardInfoDto
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create billboard' })
  async create(
    @Req() req,
    @Body() createBillboardDto: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    const newBillboard: Billboard = await this.billboardsService.create(
      req.user.id,
      createBillboardDto,
    );
    return newBillboard.toDto();
  }

  @Get('count')
  @ApiOperation({ summary: 'Get billboard count by districts of a city' })
  @HttpCode(HttpStatus.OK)
  async getCountOfBillboardsWithinDistrict(@Req() req): Promise<any> {
    return await this.billboardsService.getCountOfBillboardsWithinDistrict(
      req.body.cityName,
    );
  }

  //Search and get all billbaord by address2
  @Get('search')
  @ApiOperation({ summary: 'Search billboards' })
  @HttpCode(HttpStatus.OK)
  async search(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('address2') address2: CreateBillboardDto['address2'],
    @Query('rentalPrice') price: CreateBillboardDto['rentalPrice'],
    @Query('size_x') size_x: CreateBillboardDto['size_x'],
    @Query('size_y') size_y: CreateBillboardDto['size_y'],
    @Query('district') district: string,
  ): Promise<PageDto<BillboardInfoDto>> {
    return this.billboardsService.search(
      pageOptionsDto,
      address2,
      price,
      size_x,
      size_y,
      district,
    );
  }

  //Get All PreviousClient
  @Get('allPreClients')
  @ApiOperation({ summary: 'Get all previous clients' })
  async allPreviousClient(): Promise<any>{
    return this.billboardsService.getAllPreviousClient();
  }

  //Get One PreviousClient
  @Get('preClient/:id')
  @ApiOperation({ summary: 'Find 1 previous client' })
  async onePreviousClient(@Param('id') id: string): Promise<any> {
    return this.billboardsService.getOnePreviousClient(id);
  }

  /**
   * TODO: fix (like update user)
   * ROLE: USER (OWNER)
   * Update billboard
   */
  @Patch(':id/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update billboard info' })
  async update(
    @Param('id') id: string,
    @Body() body: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    return await this.billboardsService.update(id, body);
  }

  /**
   * only OWNER can
   * Soft-delete billboard
   */
  @Patch(':id/delete')
  @ApiTags('Billboards')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Owner delete billboard' })
  @ApiNoContentResponse({
    status: 204,
    description: 'Billboard with given id has been successfully deleted',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Billboard with given id is not exist',
  })
  async delete(
    @Req() req,
    @Param('id') id: string,
  ): Promise<UpdateResult | void> {
    return await this.billboardsService.delete(req.user.id, id);
  }

  /**
   * ROLE: any
   * Get ONE billboard
   */
  @Get(':id')
  @ApiOperation({ summary: "Get billboard's info" })
  async getOne(@Param('id') id: string): Promise<BillboardInfoDto> {
    return this.billboardsService.findOneWithRelations(id);
  }
}
