import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IGlobalStateType, IStateType } from './types';

// When empty, use relative path so verify-email link works from same host (e.g. ngrok).
const initData: IStateType = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  token: '',
  adminToken: '',
  appToken: '',
  user: null,
  permissions: [],
  collapsed: false,
};

export const useGlobal = create<IGlobalStateType>()(
  persist(
    (set) => ({
      ...initData,

      actions: {
        set,
        reset: (state) =>
          set({
            ...initData,
            ...state,
          }),
      },
    }),
    // Persistent configuration(localStorage)
    {
      name: 'project-name',
      partialize: ({ token, adminToken, appToken, collapsed }) => ({
        token,
        adminToken,
        appToken,
        collapsed,
      }),
    },
  ),
);
