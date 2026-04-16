import { PERMISSION } from '@api/constants';

export type IStateType = {
  token: string;
  adminToken: string;
  appToken: string;
  apiBaseUrl: string;
  permissions: PERMISSION[];
  collapsed: boolean;
  user: {
    name: string;
    email: string;
  } | null;
};

export type IStateActionsType = {
  set: (state: Partial<IStateType>) => void;
  reset: (state?: Partial<IStateType>) => void;
};

export type IGlobalStateType = IStateType & {
  actions: IStateActionsType;
};
