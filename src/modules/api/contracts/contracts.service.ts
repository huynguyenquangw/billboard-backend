import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { S3PrivateService } from 'src/shared/services/aws-s3-private.service';
import { Repository, UpdateResult } from 'typeorm';
import { Billboard } from '../billboards/billboard.entity';
import { BillboardsService } from '../billboards/billboards.service';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';
import { Contract } from './entities/contract.entity';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly _contractRepo: Repository<Contract>,
    @InjectRepository(Billboard)
    private readonly _billboardRepo: Repository<Billboard>,
    private readonly _billboardsService: BillboardsService,
    private readonly _s3PrivateService: S3PrivateService,
  ) {}

  /**
   * Create contract
   * @returns
   */
  async create(dto: CreateContractDto): Promise<Contract> {
    const { billboardId, ...body } = dto;

    const billboard: Billboard = await this._billboardsService.findOne(
      billboardId,
    );
    if (!billboard) {
      throw new NotFoundException('Billboard with given id does not exist');
    }

    const newContract: Contract = await this._contractRepo.create({
      ...body,
      billboard,
    });
    await this._contractRepo.save(newContract);

    // update billboard toRented
    await this._billboardRepo.save({
      ...billboard,
      ...{ status: StatusType.RENTED },
    });

    return newContract;
  }

  /**
   * Find all contracts
   * @returns
   */
  async find(): Promise<Contract[]> {
    return await this._contractRepo.find();
  }

  /**
   * Update contract
   * @returns
   */
  async update(contractId: string, body: UpdateContractDto): Promise<Contract> {
    const contractToUpdate: Contract = await this._contractRepo.findOne({
      where: {
        id: contractId,
        status: StatusType.ACTIVE,
      },
    });
    if (!contractToUpdate) {
      throw new NotFoundException(
        'Contract with given id does not exist or is expired',
      );
    }

    const updateResponse: UpdateResult = await this._contractRepo.update(
      contractId,
      {
        ...body,
      },
    );
    if (updateResponse.affected === 0) {
      throw new Error(`Error while updating contract ${contractId}`);
    }

    const updatedContract: Contract = await this._contractRepo.findOne({
      where: { id: contractId },
    });

    return updatedContract;
  }

  /**
   * Add contract's file
   * @returns
   */
  async addPrivateFile(contractId: string, file: Express.Multer.File) {
    const contractToAddFile = await this._contractRepo.findOne({
      where: { id: contractId, status: StatusType.ACTIVE },
    });

    if (!contractToAddFile) {
      throw new NotFoundException('Contract with given id does not exist!');
    }

    if (!file) {
      throw new BadRequestException('Bad Request');
    }

    const isContractPrivateFileUpdated =
      await this._s3PrivateService.isContractPrivateFileUpdated(
        contractToAddFile,
        file,
      );

    if (!isContractPrivateFileUpdated) {
      throw new Error('Upload failed!');
    }
    return { uploaded_contract_id: contractId };
  }

  /**
   * Get active contract of a billboard
   * @param billboardId
   * @returns
   */
  async getActive(billboardId: string) {
    const activeContract: Contract = await this._contractRepo
      .createQueryBuilder('contracts')
      .leftJoin('contracts.billboard', 'billboards')
      .leftJoinAndSelect('contracts.privateFile', 'private_files')
      .where('contracts.status = :status', { status: StatusType.ACTIVE })
      .andWhere('billboards.id = :billboardId', {
        billboardId: billboardId,
      })
      .getOneOrFail();

    const url = activeContract.privateFile
      ? await this._s3PrivateService.generatePresignedUrl(
          activeContract.privateFile.key,
        )
      : '';

    return { ...activeContract, presignedUrl: url };
  }

  /**
   * Cancel a contract
   * @param id
   * @returns contract after cancel
   */
  async cancel(id: string) {
    const activeContract: Contract = await this._contractRepo.findOne({
      where: { id: id, status: StatusType.ACTIVE },
    });
    if (!activeContract) {
      throw new NotFoundException(
        'Contract with given id does not exist or is expired',
      );
    }

    const contractQueryBuilder =
      this._contractRepo.createQueryBuilder('contracts');

    await contractQueryBuilder
      .update(Contract)
      .set({ status: StatusType.EXPIRED })
      .where('id = :id', { id: id })
      .execute();

    return await this.findOne(id);
  }

  /**
   * Create contract
   * @returns
   */
  async findOne(id: string): Promise<Contract> {
    const contract = await this._contractRepo.findOne({ where: { id: id } });
    if (!contract) {
      throw new NotFoundException('Contract with given id does not exist');
    }

    return contract;
  }
}
