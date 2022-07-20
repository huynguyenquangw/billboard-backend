import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { Billboard } from './billboards/billboard.entity';
import { BillboardsModule } from './billboards/billboards.module';
import { PlansModule } from './plans/plans.module';
import {
  ApproveBillboardController,
  ApproveBillboardUseCase,
} from './useCase/billboardManagement/admin/operator/approveBillboard';
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
    ApproveBillboardController,
    LoggedInUserRoleCheckController,
    DeleteAndRestoreUserController,
    GetAllBillboardsByStatusController,
    GetAllBillboardsWithFilterController,
    GetOneUserController,
    PublishBillboardController,
  ],
  providers: [
    ApproveBillboardUseCase,
    LoggedInUserRoleCheckUseCase,
    DeleteAndRestoreUserUseCase,
    GetAllBillboardsByStatusUseCase,
    GetAllBillboardsWithFilterUseCase,
    GetOneUserUseCase,
    PublishBillboardUseCase,
  ],
})
export class ApiModule {}
