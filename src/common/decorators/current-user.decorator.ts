import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import {
  type AuthenticatedRequest,
  type AuthenticatedUser,
} from '../guards/auth.guard';

/**
 * TYPE 1b — createParamDecorator
 *
 * createParamDecorator is used when you need to extract something from the
 * request that NestJS doesn't expose natively via @Param/@Query/@Body.
 * The factory receives:
 *   - data    = the argument passed to the decorator
 *   - context = gives access to req, res, and the handler metadata
 *
 * AuthGuard populates req.user with the full better-auth session user.
 * This decorator reads it cleanly without touching auth logic in controllers.
 *
 * Usage:
 *   @Get('me')
 *   getProfile(@CurrentUser() user: AuthenticatedUser) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_: undefined, ctx: ExecutionContext): AuthenticatedUser | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);

export type { AuthenticatedUser } from '../guards/auth.guard';
