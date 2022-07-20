import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/api/users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this._reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = <User>request.user;

    return roles.includes(user.role);
  }
}

// const RoleGuard = (roles: RoleType): Type<CanActivate> => {
//   class RoleGuardMixin extends JwtAuthGuard {
//     constructor(private readonly _reflector: Reflector) {
//       super();
//     }

//     async canActivate(context: ExecutionContext) {
//       await super.canActivate(context);

//       const roles = this._reflector.get<string[]>(
//         'roles',
//         context.getHandler(),
//       );

//       if (!roles) {
//         return true;
//       }

//       const request = context.switchToHttp().getRequest();
//       const user = <User>request.user;

//       return roles.includes(user.role);
//     }
//   }
//   return mixin(RoleGuardMixin);
// };

// export default RoleGuard;
