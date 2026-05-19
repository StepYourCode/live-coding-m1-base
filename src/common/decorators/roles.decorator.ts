import { SetMetadata } from '@nestjs/common';
import { ac } from '../../lib/access';

/**
 * Metadata key used to store permission requirements on a route handler.
 * Read by RolesGuard via the Reflector service to enforce access control.
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Maps resource names to their allowed actions, derived from the access
 * control schema defined in lib/access.ts. Ensures that both the resource
 * and the actions passed to @RequirePermission are valid at compile time.
 */
type Statements = typeof ac.statements;

/**
 * Route decorator that restricts access to users whose role has the specified
 * permission on a given resource.
 *
 * Internally calls SetMetadata to attach `{ [resource]: actions }` to the
 * route handler. RolesGuard reads this metadata, looks up the session user's
 * role in the access control registry, and calls role.authorize() to decide
 * whether to allow or reject the request.
 *
 * @param resource - The resource to protect (e.g. 'user'). Must be a key
 *                   defined in the access control schema (lib/access.ts).
 * @param actions  - One or more actions required on that resource
 *                   (e.g. 'list', 'view'). All listed actions must be granted
 *                   by the role (AND connector).
 *
 * @example
 * Only roles that have the 'list' permission on 'user' can call this route
 * @Get()
 * @RequirePermission('user', 'list')
 * findAll() { ... }
 *
 * @example
 * Require multiple actions at once
 * @Patch(':id')
 * @RequirePermission('user', 'view', 'update')
 * update() { ... }
 */
export const RequirePermission = <R extends keyof Statements>(
  resource: R,
  ...actions: Statements[R][number][]
) => SetMetadata(PERMISSIONS_KEY, { [resource]: actions });
