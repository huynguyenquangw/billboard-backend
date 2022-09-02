import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/api/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestCronService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
  ) {}
  private readonly logger = new Logger(TestCronService.name);

  // @Cron('5 * * * * *')
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    this.logger.debug('Cron job is running...');

    // const userId = 'b4843b70-dbd5-4881-8fa2-799a35e96c49';
    // const user = await this._userRepo.findOne({
    //   where: { id: userId },
    // });
    // // console.log(user);
    // let value = '';
    // if (user.address2 === null || user.address2 === '222222222') {
    //   value = '111111111';
    // } else if (user.address2 === '111111111') {
    //   value = '222222222';
    // }
    // const queryBuilder = this._userRepo.createQueryBuilder('users');
    // queryBuilder
    //   .update(User)
    //   .set({
    //     address2: value,
    //   })
    //   .where('id = :id', { id: userId })
    //   .execute();
    // this.logger.debug(
    //   "User's 2nd address was changed",
    //   (await this._userRepo.findOne({ where: { id: userId } })).address2,
    // );
    // this.logger.debug('Finished!');
  }
}
