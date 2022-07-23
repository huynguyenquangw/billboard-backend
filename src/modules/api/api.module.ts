import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { Billboard } from './billboards/billboard.entity';
import { BillboardsModule } from './billboards/billboards.module';
import { PlansModule } from './plans/plans.module';
import {
  GetAllBillboardsController,
  GetAllBillboardsUseCase,
} from './useCase/billboardManagement/admin/getAll';
import {
  ApproveBillboardController,
  ApproveBillboardUseCase,
} from './useCase/billboardManagement/admin/operator/approveBillboard';
import {
  RejectBillboardController,
  RejectBillboardUseCase,
} from './useCase/billboardManagement/admin/operator/rejectBillboard';
import {
  GetAllPendingBillboardsController,
  GetAllPendingBillboardsUseCase,
} from './useCase/billboardManagement/admin/operator/getAllPendingBillboards';
import {
  DeleteAndRestoreBillboardController,
  DeleteAndRestoreBillboardUseCase,
} from './useCase/billboardManagement/admin/softDelete';
import {
  GetAllBillboardsByStatusController,
  GetAllBillboardsByStatusUseCase,
} from './useCase/billboardManagement/getAllByStatus';
import {
  GetAllBillboardsWithFilterController,
  GetAllBillboardsWithFilterUseCase,
} from './useCase/billboardManagement/getAllWithFilter';
import {
  PublishBillboardController,
  PublishBillboardUseCase,
} from './useCase/billboardManagement/publish';
import { GetAllUserController } from './useCase/user/getAll/GetAllUser.controller';
import { GetAllUserUseCase } from './useCase/user/getAll/GetAllUser.useCase';
import { GetOneUserController, GetOneUserUseCase } from './useCase/user/getOne';
import {
  LoggedInUserRoleCheckController,
  LoggedInUserRoleCheckUseCase,
} from './useCase/user/loggedInUserRoleCheck';
import {
  DeleteAndRestoreUserController,
  DeleteAndRestoreUserUseCase,
} from './useCase/user/softDelete';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Billboard]),
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
    DeleteAndRestoreBillboardController,
    GetAllBillboardsByStatusController,
    GetAllBillboardsWithFilterController,
    PublishBillboardController,
    GetAllUserController,
    LoggedInUserRoleCheckController,
    DeleteAndRestoreUserController,
    GetOneUserController,
  ],
  providers: [
    GetAllBillboardsUseCase,
    ApproveBillboardUseCase,
    RejectBillboardUseCase,
    GetAllPendingBillboardsUseCase,
    DeleteAndRestoreBillboardUseCase,
    GetAllBillboardsByStatusUseCase,
    GetAllBillboardsWithFilterUseCase,
    PublishBillboardUseCase,
    GetAllUserUseCase,
    LoggedInUserRoleCheckUseCase,
    DeleteAndRestoreUserUseCase,
    GetOneUserUseCase,
  ],
})
export class ApiModule {}
