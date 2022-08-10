import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { PlanInfoDto } from './dto/plan-info.dto';
import { Plan } from './plans.entity';

@Injectable()
export class PlansService {
  private stripe: Stripe;
  constructor(
    private config: ConfigService,
    @InjectRepository(Plan)
    private readonly plansRepo: Repository<Plan>,
  ) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY'),{apiVersion: '2022-08-01'})
  }

  /**
   * Create a plan
   * by ADMIN
   */
  async create(planDto: PlanInfoDto): Promise<Plan> {
    const newPlan: Plan = await this.plansRepo.create({
      ...planDto,
    });

    return this.plansRepo.save(newPlan);
  }

  /**
   * Get all plans
   * by ADMIN
   */
  async getAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Plan>> {
    const queryBuilder =
      this.plansRepo.createQueryBuilder('plans');

    queryBuilder
      .orderBy('plans.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .addSelect('plans.deletedAt')
      .withDeleted();

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Update a plan info
   */
   async update(
    planId: string,
    body: PlanInfoDto,
  ): Promise<Plan> {
    const planToUpdate = await this.plansRepo.findOne({
      where: { id: planId},
    });

    if (!planToUpdate) {
      throw new NotFoundException();
    }

    let fullUpdateData = {};
    fullUpdateData = body;

    await this.plansRepo.update(planId, fullUpdateData);
    const updatedPlan = await this.getOne(planId);
    return updatedPlan
  }

  /**
   * Pay to subscribe to a plan
   */
  async pay(payAmount: number, customerId: string): Promise<any>{
    try {
      const payment= await this.stripe.paymentIntents.create({
        amount: payAmount,
        currency: "USD",
        description: "Plan Purchased",
        payment_method: customerId,
        confirm: true,
      })
      return payment
      
    } catch (error) {
      console.log("Error: ", error)
    }

  }

  /**
   * Get one plan info
   */
  async getOne(planId: string): Promise<Plan>{
    return await this.plansRepo.findOne({
        where:{ id: planId }
    })
  }
}
