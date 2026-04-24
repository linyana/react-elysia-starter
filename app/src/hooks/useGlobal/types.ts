import { PERMISSION } from '@api/constants';

export type IStateType = {
  token: string;
  adminToken: string;
  apiBaseUrl: string;
  permissions: PERMISSION[];
  collapsed: boolean;
  user: {
    name: string;
    email: string;
  } | null;
  /**
   * Whether the first-paint auth hydration has completed.
   * - Starts `false` on every app load (never persisted).
   * - `AuthGate` flips it to `true` after the initial `/auth/me` resolves
   *   (or immediately if there's no token to resolve).
   * - Once `true`, it stays `true` for the rest of the session — subsequent
   *   state changes (login, logout) must not toggle it back.
   *
   * This is what makes route guards purely synchronous: by the time any
   * `AuthProvider` runs, `user` is either loaded or definitively absent.
   */
  hydrated: boolean;
};

export type IStateActionsType = {
  set: (state: Partial<IStateType>) => void;
  reset: (state?: Partial<IStateType>) => void;
};

export type IGlobalStateType = IStateType & {
  actions: IStateActionsType;
};
