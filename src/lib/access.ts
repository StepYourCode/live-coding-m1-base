import { createAccessControl } from 'better-auth/plugins/access';

export enum Roles {
  User = 'user',
  Admin = 'admin',
}

export const ac = createAccessControl({
  user: ['create', 'list', 'view', 'update', 'delete'],
  review: ['create', 'view', 'update', 'delete', 'update:any', 'delete:any'],
} as const);

export const roles = {
  [Roles.User]: ac.newRole({
    user: ['view'],
    review: ['create', 'view', 'update', 'delete'],
  }),
  [Roles.Admin]: ac.newRole({
    user: ['create', 'list', 'view', 'update', 'delete'],
    review: ['create', 'view', 'update', 'delete', 'update:any', 'delete:any'],
  }),
} as const;
