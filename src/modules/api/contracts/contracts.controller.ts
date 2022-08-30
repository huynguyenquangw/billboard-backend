import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TransformInterceptor } from 'src/interceptors/TransformInterceptor.service';
import { JwtAuthGuard } from 'src/modules/auth/oauth/guards/jwt-authentication.guard';
import { ContractsService } from './contracts.service';
import { ContractInfoDto } from './dtos/contract-info.dto';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';

@Controller('api/contracts')
@ApiTags('Contracts')
export class ContractsController {
  constructor(
    @Inject(ContractsService)
    private readonly _contractsService: ContractsService,
  ) {}

  /**
   * Create contract
   * @param body
   * @returns created contract's detail
   */
  @Post('create')
  @ApiOperation({ summary: "Create billboard's contract" })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: "Return created contract's detail",
    type: ContractInfoDto,
  })
  @ApiBadGatewayResponse({
    status: 400,
    description: 'Bad request',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  async create(@Body() body: CreateContractDto) {
    const result = this._contractsService.create(body);
    return { message: 'Created', result };
  }

  /**
   * Find all contracts
   * @returns list of contracts
   */
  @Get('all')
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiOkResponse({
    status: 200,
    description: 'Return list of contracts',
    type: ContractInfoDto,
  })
  @ApiNoContentResponse({
    status: 204,
    description: 'Empty!',
  })
  @UseInterceptors(TransformInterceptor)
  async find() {
    const result = await this._contractsService.find();
    return { message: 'OK', result };
  }

  /**
   * Update billboard's contract
   * @param body
   * @returns contract detail
   */
  @Patch(':id/update')
  @ApiOperation({ summary: "Update billboard's contract" })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'OK',
    type: ContractInfoDto,
  })
  @ApiBadGatewayResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Contract with given id does not exist',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  async update(@Param('id') id: string, @Body() body: UpdateContractDto) {
    const result = this._contractsService.update(id, body);
    return { message: "Update billboard's contract successfully", result };
  }

  /**
   * Create a new billboard
   * @param req
   * @returns BillboardInfoDto
   */
  @Post(':id/update/file')
  @ApiOperation({ summary: "Add contract's private files" })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: "Add contract's private files successfully",
    type: ContractInfoDto,
  })
  @ApiBadGatewayResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Contract with given id does not exist',
  })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'), TransformInterceptor)
  async addPrivateFiles(
    @Param('id') id: string,
    @UploadedFiles() file: Express.Multer.File,
  ) {
    const result = await this._contractsService.addPrivateFile(id, file);

    return { message: "Add contract's private files successfully", result };
  }

  //TODO: get billboard's active contract
  /**
   * Get active contract of a billboard
   * @param billboardId
   * @returns active contract of a billboard
   */
  @Get('active/:billboardId')
  @ApiOperation({ summary: 'Get active contract of a billboard' })
  @ApiOkResponse({
    status: 200,
    description: 'Return active contract of a billboard',
    type: ContractInfoDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Billboard with given id does not exist',
  })
  @UseInterceptors(TransformInterceptor)
  async getActive(@Param('billboardId') billboardId: string) {
    const activeContract = await this._contractsService.getActive(billboardId);

    return activeContract !== null || activeContract !== undefined
      ? { message: 'OK', result: activeContract }
      : { message: 'No active contract found!', result: activeContract };
  }

  //TODO: billboard's owner --cancel-> an active contract
  /**
   * Cancel a contract
   * @param id
   * @returns contract after cancel
   */
  @Get(':id/cancel')
  @ApiOperation({ summary: 'Cancel a contract' })
  @ApiOkResponse({
    status: 204,
    description: 'Cancel contract successfully',
    type: ContractInfoDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Contract with given id does not exist',
  })
  @UseInterceptors(TransformInterceptor)
  async cancel(@Param('id') id: string) {
    const result = await this._contractsService.cancel(id);

    return { message: 'Cancel contract successfully', result };
  }

  /**
   * Find 1 contract by id
   * @param id
   * @returns contract info
   */
  @Get(':id')
  @ApiOperation({ summary: "Get contract's detail" })
  @ApiOkResponse({
    status: 200,
    description: "Return contract's detail",
    type: ContractInfoDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Contract with given id does not exist',
  })
  @UseInterceptors(TransformInterceptor)
  async findOne(@Param('id') id: string) {
    const contract = await this._contractsService.findOne(id);
    return { message: 'OK', result: contract.toDto() };
  }
}
