/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// auth/module-access.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredModule =
      this.reflector.get<string>('module', context.getHandler()) ||
      this.reflector.get<string>('module', context.getClass());

    if (!requiredModule) return true;

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user.role.modules) throw new ForbiddenException('No role assigned');

    const userModuleNames = user.role.modules;

    const hasAccess = userModuleNames.includes(requiredModule);
    if (!hasAccess)
      throw new ForbiddenException('Access denied to this module');

    return true;
  }
}
