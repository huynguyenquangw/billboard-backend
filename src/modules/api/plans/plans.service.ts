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
  async getAllPlan(
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
   * Get one plan info
   */
   async getOnePlan(planId: string): Promise<Plan>{
    return await this.plansRepo.findOne({
        where:{ id: planId }
    })
  }

  /**
   * Get One Subscription info
   */
   async getOneSub(subId :string): Promise<Subscription>{
    const sub = await this.SubRepo.findOne({
      relations: ['plan', 'subscriber'],
      where:{
        id: subId,
        status: StatusType.SUCCESS,
      }
    })

    if(sub){
      return sub
    }
    throw new NotFoundException(subId)
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
    const updatedPlan = await this.getOnePlan(planId);
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
 
      const plan = await this.getOnePlan(planId)
      const user = await this._usersService.findOne(userId);
      const newSub= this.SubRepo.create({
        plan: plan,
        subscriber: user,
        code: payment.id,
        remainingPost: plan.postLimit,
        status: StatusType.SUCCESS,
      })

      const paidDate = new Date();
      newSub.expiredAt = new Date(paidDate.setMonth(paidDate.getMonth()+plan.duration));
      await this.SubRepo.save(newSub);
      return payment
      
    } catch (error) {
      console.log("Error: ", error)
    }

  }

  /**
   * Unsubscribe a subscription
   */
  async unsubscribe(subId :string): Promise<Subscription>{
    const findSub = await this.getOneSub(subId);
    findSub.status = StatusType.CANCELED;

    return await this.SubRepo.save(findSub)
  }

  /**
   * Check if the user is subscribed
   */
  async checkSubByUser(subscriberId: string): Promise<Subscription>{
    const findSub = await this.SubRepo.findOne({
      relations:['plan', 'subscriber'],
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
}
