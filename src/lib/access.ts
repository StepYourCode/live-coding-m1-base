import { createAccessControl } from 'better-auth/plugins/access';

export const ac = createAccessControl({
  user: ['create', 'list', 'view', 'update', 'delete'],
} as const);

export const roles = {
  user: ac.newRole({
    user: ['view'],
  }),
  admin: ac.newRole({
    user: ['create', 'list', 'view', 'update', 'delete'],
  }),
} as const;
