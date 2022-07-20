import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/constants';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
