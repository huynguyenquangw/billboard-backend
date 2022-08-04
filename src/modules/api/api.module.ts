import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { Billboard } from './billboards/billboard.entity';
import { BillboardsModule } from './billboards/billboards.module';
import { Plan } from './plans/plans.entity';
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
  GetAllBillboardsByStatusController,
  GetAllBillboardsByStatusUseCase,
} from './useCase/billboardManagement/anonymousUser/getAllBillboardsByStatus';
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
  GetAllOperatorsController,
  GetAllOperatorsUseCase,
} from './useCase/operationManagement/getAllOperators';
import { 
  DeleteAndRestorePlansController, 
  DeleteAndRestorePlansUseCase, 
} from './useCase/planManagement/admin/softDeletePlans';
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
  DeleteAndRestoreUserController,
  DeleteAndRestoreUserUseCase,
} from './useCase/userManagement/softDeleteUser';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Billboard, Plan]),
    UsersModule,
    BillboardsModule,
    PlansModule,
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
    DeleteAndRestoreUserUseCase,
    GetOneUserUseCase,
    DeleteAndRestorePlansUseCase,
  ],
})
export class ApiModule {}
