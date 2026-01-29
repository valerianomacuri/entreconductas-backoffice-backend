// RoleGuard ensures only admin users can access guarded handlers.
// Apply alongside JwtAuthGuard using @UseGuards(JwtAuthGuard, RoleGuard) so the
// request includes a validated JWT payload before the role check runs.
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authenticated user context is required');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Admin role is required to access this route',
      );
    }

    return true;
  }
}
