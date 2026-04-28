export type IPermission = string;

export const PERMISSION_WILDCARD = '*';

export type IPermissionResult =
  | { ok: true }
  | { ok: false; status: 401 | 403; message: string };
