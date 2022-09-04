import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RoleType } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { TransformInterceptor } from 'src/interceptors/TransformInterceptor.service';
// import RolesGuard from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { UpdateResult } from 'typeorm';
import { Billboard } from './billboard.entity';
import { BillboardsService } from './billboards.service';
import { BillboardInfoDto } from './dto/billboard-info.dto';
import { CreateBillboardDto } from './dto/create-billboard.dto';
import { UpdateBillboardDto } from './dto/update-billboard.dto';

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
  @ApiOperation({ summary: 'Create billboard' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req,
    @Body() createBillboardDto: CreateBillboardDto,
  ): Promise<BillboardInfoDto> {
    const newBillboard: Billboard = await this._billboardsService.create(
      createBillboardDto,
      req.user.id,
    );
    return newBillboard.toDto();
  }

  /**
   * TODO: fix (like update user)
   * ROLE: USER (OWNER)
   * Update billboard
   */
  @Patch(':id/update')
  @ApiOperation({ summary: 'Update billboard info' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') billboardId: string,
    @Body() body: UpdateBillboardDto,
  ): Promise<BillboardInfoDto> {
    return await this._billboardsService.update(billboardId, body);
  }

  /**
   * Create a new billboard
   * @param req
   * @returns BillboardInfoDto
   */
  @Post(':id/addpictures')
  @ApiOperation({ summary: "Add billboard's pictures" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('pictures'), TransformInterceptor)
  async addPictures(
    @Param('id') billboardId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const result = await this._billboardsService.addPictures(
      billboardId,
      files,
    );

    return { message: "Add billboard's pictures successfully", result };
  }

  @Get('count')
  @ApiOperation({ summary: 'Get billboard count by districts of a city' })
  @HttpCode(HttpStatus.OK)
  async getCountOfBillboardsWithinDistrict(@Req() req): Promise<any> {
    return await this._billboardsService.getCountOfBillboardsWithinDistrict(
      req.body.cityName,
    );
  }

  /**
   * only OWNER can
   * Soft-delete billboard
   */
  @Patch(':id/delete')
  @ApiTags('Billboards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.USER, RoleType.ADMIN)
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
    description: 'Billboard with given id does not exist',
  })
  async delete(
    @Req() req,
    @Param('id') billboardId: string,
  ): Promise<UpdateResult | void> {
    return await this._billboardsService.delete(req.user.id, billboardId);
  }

  /**
   * CURRENT USER - OWNER
   * Publish billboard
   * @returns draft billboard list with pagination
   */
  @Post(':id/publish')
  @ApiOperation({
    summary: 'Submit a draft billboard to operation',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    description: 'Billboard with given id does not exist',
  })
  @HttpCode(HttpStatus.OK)
  async publish(@Req() req, @Param('id') id: string): Promise<any> {
    return this._billboardsService.publish(req.user.id, id);
  }

  @Post('preClient/create/multiple')
  @ApiOperation({ summary: 'Create new previous clients' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully create new previous clients',
  })
  @UseInterceptors(TransformInterceptor)
  async createMultiplePreClients(@Body() clients: Array<any>): Promise<any> {
    const result = await this._billboardsService.createMultiplePreClients(
      clients,
    );

    return { message: 'Create new previous clients successfully', result };
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
