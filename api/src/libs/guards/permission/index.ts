import { Elysia } from 'elysia';
import type { ITokenClaims } from '../auth';
import {
  PERMISSION_WILDCARD,
  type IPermission,
  type IPermissionResult,
} from './types';

export * from './types';

const checkPermission = (
  auth: ITokenClaims | undefined,
  required: IPermission | IPermission[],
): IPermissionResult => {
  if (!auth) return { ok: false, status: 401, message: 'Unauthenticated' };
  if (auth.permissions.includes(PERMISSION_WILDCARD)) return { ok: true };
  const need = Array.isArray(required) ? required : [required];
  const lacking = need.filter((p) => !auth.permissions.includes(p));
  if (lacking.length) {
    return { ok: false, status: 403, message: `Missing permission: ${lacking.join(', ')}` };
  }
  return { ok: true };
};

export const permissionGuard = new Elysia({ name: 'libs/guards/permission' })
  .macro('permissions', (required: IPermission | IPermission[]) => ({
    // contract: routes using `hasPermission` must also enable `auth` so that
    // `auth` has been resolved into context by the time this hook runs.
    resolve: (ctx) => {
      const { auth } = ctx as typeof ctx & { auth?: ITokenClaims };
      const result = checkPermission(auth, required);
      if (!result.ok) {
        ctx.set.status = result.status;
        throw new Error(result.message);
      }
      return {};
    },
  }));
