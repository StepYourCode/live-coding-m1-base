import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';

type RequestWithUser = Request & { user?: { role?: string } };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Reflector reads the metadata attached by @Roles() via SetMetadata(ROLES_KEY, roles).
    // getAllAndOverride checks the two targets in order and returns the first match:
    //   1. context.getHandler() — the route method (e.g. remove())
    //   2. context.getClass()   — the controller class (e.g. ParksController)
    // The handler wins over the class, so a method-level @Roles() can narrow or override
    // a class-level @Roles(). Returns undefined when neither target has the metadata,
    // which the next line interprets as "no role restriction on this route".
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (!user) throw new ForbiddenException();

    if (!required.some((role) => user.role === role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
