import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/roles.decorator';
import { AuthenticatedRequest } from './auth.guard';
import { roles } from '../../lib/access';

type PermissionRequest = Parameters<
  (typeof roles)[keyof typeof roles]['authorize']
>[0];

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<PermissionRequest>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) return true;

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!user) throw new ForbiddenException();

    const roleName = (user as { role?: string }).role ?? 'user';
    const roleObj = roles[roleName as keyof typeof roles];
    if (!roleObj) throw new ForbiddenException();

    const { success } = roleObj.authorize(required);
    if (!success) throw new ForbiddenException();

    return true;
  }
}
