import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/constants';
import { Billboard } from 'src/modules/api/billboards/billboard.entity';
import { BillboardsService } from 'src/modules/api/billboards/billboards.service';
import { PlanDto } from 'src/modules/api/plans/dto/plans.dto';
import { Plan } from 'src/modules/api/plans/plans.entity';
import { IsNull, Not, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CreatePlansUseCase {
  constructor(
    @InjectRepository(Billboard)
    private readonly planRepo: Repository<Plan>,
  ) {}

  /**
   * Create a plan
   * by ADMIN
   */
  async create(planDto: PlanDto): Promise<Plan> {
    const newPlan: Plan= await this.planRepo.create({
        ...planDto,
    });

    return this.planRepo.save(newPlan)

  }
}