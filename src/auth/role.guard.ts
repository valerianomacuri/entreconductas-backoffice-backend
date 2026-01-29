// RoleGuard enforces single-role authorization on handlers that declare metadata.
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRole } from '../users/entities/user.entity';

export const ROLE_KEY = 'role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<UserRole>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    if (!user?.role) {
      throw new ForbiddenException('Role missing from authenticated user');
    }

    if (user.role !== requiredRole) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    return true;
  }
}
