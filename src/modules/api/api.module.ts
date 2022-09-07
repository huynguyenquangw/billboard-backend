import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { Billboard } from './billboards/billboard.entity';
import { BillboardsModule } from './billboards/billboards.module';
import { ContractsModule } from './contracts/contracts.module';
import { Contract } from './contracts/entities/contract.entity';
import { Plan } from './plans/entities/plans.entity';
import { Subscription } from './plans/entities/subscriptions.entity';
import { PlansModule } from './plans/plans.module';
import {
  GetAllBillboardsController,
  GetAllBillboardsUseCase,
} from './useCase/billboardManagement/admin/getAll';
import {
  RestoreBillboardController,
  RestoreBillboardUseCase,
} from './useCase/billboardManagement/admin/restore';
import {
  GetAllBillboardsWithFilterController,
  GetAllBillboardsWithFilterUseCase,
} from './useCase/billboardManagement/anonymousUser/getAllBillboardsWithFilter';
import {
  ApproveBillboardController,
  ApproveBillboardUseCase,
} from './useCase/billboardManagement/operator/approveBillboardByOperator';
import {
  GetAllPendingBillboardsController,
  GetAllPendingBillboardsUseCase,
} from './useCase/billboardManagement/operator/getAllPendingBillboardsByOperator';
import {
  RejectBillboardController,
  RejectBillboardUseCase,
} from './useCase/billboardManagement/operator/rejectBillboardByOperator';
import {
  GetAllBillboardsByStatusController,
  GetAllBillboardsByStatusUseCase,
} from './useCase/billboardManagement/owner/getAllBillboardsByStatus';
import {
  GetAllOperatorsController,
  GetAllOperatorsUseCase,
} from './useCase/operationManagement/getAllOperators';
import {
  DeleteAndRestorePlansController,
  DeleteAndRestorePlansUseCase,
} from './useCase/planManagement/admin/softDeletePlans';
import { CheckExpiredContractService } from './useCase/taskScheduling/checkExpiredContract';
import { CheckExpiredSubscriberService } from './useCase/taskScheduling/checkExpiredSubscriber';
import { TestCronService } from './useCase/taskScheduling/testCron';
// import {
//   PublishBillboardController,
//   PublishBillboardUseCase,
// } from './useCase/billboardManagement/publishBillboard';
import {
  LoggedInUserRoleCheckController,
  LoggedInUserRoleCheckUseCase,
} from './useCase/userManagement/checkRoleCurrentUser';
import {
  GetAllUsersController,
  GetAllUsersUseCase,
} from './useCase/userManagement/getAllUsers';
import {
  GetOneUserController,
  GetOneUserUseCase,
} from './useCase/userManagement/getOneUser';
import {
  PromoteAdminController,
  PromoteAdminUseCase,
} from './useCase/userManagement/promoteAdmin';
import {
  DeleteAndRestoreUserController,
  DeleteAndRestoreUserUseCase,
} from './useCase/userManagement/softDeleteUser';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Billboard, Plan, Subscription, Contract]),
    UsersModule,
    BillboardsModule,
    PlansModule,
    ContractsModule,
    AddressModule,
  ],
  controllers: [
    GetAllBillboardsController,
    ApproveBillboardController,
    RejectBillboardController,
    GetAllPendingBillboardsController,
    RestoreBillboardController,
    GetAllBillboardsByStatusController,
    GetAllBillboardsWithFilterController,
    // PublishBillboardController,
    GetAllOperatorsController,
    GetAllUsersController,
    LoggedInUserRoleCheckController,
    PromoteAdminController,
    DeleteAndRestoreUserController,
    GetOneUserController,
    DeleteAndRestorePlansController,
  ],
  providers: [
    GetAllBillboardsUseCase,
    ApproveBillboardUseCase,
    RejectBillboardUseCase,
    GetAllPendingBillboardsUseCase,
    RestoreBillboardUseCase,
    GetAllBillboardsByStatusUseCase,
    GetAllBillboardsWithFilterUseCase,
    // PublishBillboardUseCase,
    GetAllOperatorsUseCase,
    GetAllUsersUseCase,
    LoggedInUserRoleCheckUseCase,
    PromoteAdminUseCase,
    DeleteAndRestoreUserUseCase,
    GetOneUserUseCase,
    DeleteAndRestorePlansUseCase,
    CheckExpiredSubscriberService,
    CheckExpiredContractService,
    TestCronService,
  ],
})
export class ApiModule {}
