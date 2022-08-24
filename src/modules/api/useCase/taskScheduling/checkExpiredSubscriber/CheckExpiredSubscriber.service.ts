import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType, UserType } from 'src/constants';
import { Subscription } from 'src/modules/api/plans/entities/subscriptions.entity';
import { User } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CheckExpiredSubscriberService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
    @InjectRepository(Subscription)
    private readonly _subscriptionRepo: Repository<Subscription>,
  ) {}
  private readonly logger = new Logger(CheckExpiredSubscriberService.name);

  /**
   * Cron job
   * Check expired subcriber
   * Every midnight
   */
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron('0 30 0 * * *')
  async checkExpiredSubscriber() {
    // check all SUCCESS subscription
    const today = new Date();
    const expiredSubs: Subscription[] = await this._subscriptionRepo
      .createQueryBuilder('subscriptions')
      .leftJoinAndSelect('subscriptions.subscriber', 'users')
      .where('subscriptions.status = :status', { status: StatusType.SUCCESS })
      .andWhere('subscriptions.expiredAt < :today', {
        today: today,
      })
      .getMany();

    const expiredSubAndUserIds = expiredSubs.map((sub) => {
      return { expiredSubId: sub.id, expiredSubcriberId: sub.subscriber.id };
    });
    this.logger.debug(expiredSubAndUserIds);
    console.log(expiredSubAndUserIds);

    const userQueryBuilder = this._userRepo.createQueryBuilder('users');
    const subQueryBuilder =
      this._subscriptionRepo.createQueryBuilder('subscriptions');
    expiredSubAndUserIds.forEach((e) => {
      subQueryBuilder
        .update(Subscription)
        .set({ status: StatusType.CANCELED })
        .where('id = :id', { id: e.expiredSubId })
        .execute();

      userQueryBuilder
        .update(User)
        .set({ userType: UserType.FREE })
        .where('id = :id', { id: e.expiredSubcriberId })
        .execute();
    });
  }
}
