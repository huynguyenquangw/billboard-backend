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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
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
  constructor(private readonly _billboardsService: BillboardsService) {}

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
    const newBillboard: Billboard = await this._billboardsService.create(
      req.user.id,
      createBillboardDto,
    );
    return newBillboard.toDto();
  }

  @Get('count')
  @ApiOperation({ summary: 'Get billboard count by districts of a city' })
  @HttpCode(HttpStatus.OK)
  async getCountOfBillboardsWithinDistrict(@Req() req): Promise<any> {
    return await this._billboardsService.getCountOfBillboardsWithinDistrict(
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
    return this._billboardsService.search(
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
  async allPreviousClient(): Promise<any> {
    return this._billboardsService.getAllPreviousClient();
  }

  //Get One PreviousClient
  @Get('preClient/:id')
  @ApiOperation({ summary: 'Find 1 previous client' })
  async onePreviousClient(@Param('id') id: string): Promise<any> {
    return this._billboardsService.getOnePreviousClient(id);
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
    return await this._billboardsService.update(id, body);
  }

  /**
   * only OWNER can
   * Soft-delete billboard
   */
  @Patch(':id/delete')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Billboards')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @UseGuards(RolesGuard)
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
    @Param('id') billboardId: string,
  ): Promise<UpdateResult | void> {
    console.log(req.user);

    return await this._billboardsService.delete(req.user.id, billboardId);
  }

  @Post('file')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    // return this._billboardsService.addFile(file.buffer, file.originalname);
  }

  /**
   * ROLE: any
   * Get ONE billboard
   */
  @Get(':id')
  @ApiOperation({ summary: "Get billboard's info" })
  async getOne(@Param('id') id: string): Promise<BillboardInfoDto> {
    const billboard = await this._billboardsService.findOneWithRelations(id);
    return billboard.toDto();
  }
}
