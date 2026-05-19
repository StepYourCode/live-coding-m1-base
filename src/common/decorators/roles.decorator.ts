import { SetMetadata } from '@nestjs/common';
import { ac } from '../../lib/access';

export const PERMISSIONS_KEY = 'permissions';

type Statements = typeof ac.statements;

export const RequirePermission = <R extends keyof Statements>(
  resource: R,
  ...actions: Statements[R][number][]
) => SetMetadata(PERMISSIONS_KEY, { [resource]: actions });
