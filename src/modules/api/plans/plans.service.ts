import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { StatusType } from 'src/constants';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PlanInfoDto } from './dto/plan-info.dto';
import { Plan } from './entities/plans.entity';
import { Subscription } from './entities/subscriptions.entity';

@Injectable()
export class PlansService {
  private stripe: Stripe;
  constructor(
    private config: ConfigService,
    @InjectRepository(Plan)
    private readonly plansRepo: Repository<Plan>,
    @InjectRepository(Subscription)
    private readonly SubRepo: Repository<Subscription>,
    private readonly _usersService: UsersService,
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
   * Get all Published plans
   */
  async getAllPublished(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Plan>> {
    const queryBuilder =
      this.plansRepo.createQueryBuilder('plans');

    queryBuilder
      .orderBy('plans.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where('plans.status = :status', { status: StatusType.PUBLISHED })

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
  async pay(userId: string , planId: string , payAmount: number, cardId: string): Promise<any>{
    try {
      const payment= await this.stripe.paymentIntents.create({
        amount: payAmount,
        currency: "VND",
        description: "Plan Purchased",
        payment_method: cardId,
        confirm: true,
      })
 
      const plan = await this.getOne(planId)
      const user = await this._usersService.findOne(userId);
      const newSub= await this.SubRepo.create({
        plan: plan,
        subscriber: user,
        code: payment.id,
        remainingPost: plan.postLimit,
        status: StatusType.SUCCESS,
      })

      newSub.expiredAt = new Date(newSub.createdAt.setMonth(newSub.createdAt.getMonth()+plan.duration));
      this.SubRepo.save(newSub);
      return payment
      
    } catch (error) {
      console.log("Error: ", error)
    }

  }

  /**
   * Unsubscribe a subscription
   */
  async unsubscribe(subId :string): Promise<Subscription>{
    const findSub = await this.SubRepo.findOne({
      where:{
        id: subId,
      }
    })

    return await this.SubRepo.remove(findSub)
  }

  /**
   * Check if the user is sub
   */
  async checkSub(subscriberId: string): Promise<Subscription>{
    const findSub = await this.SubRepo.findOne({
      relations:['subscriber'],
      where:{
        subscriber:{
          id: subscriberId,
        },
        status: StatusType.SUCCESS
      }
    })
    if(findSub){
      return findSub
    }
    throw new NotFoundException(subscriberId)

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
