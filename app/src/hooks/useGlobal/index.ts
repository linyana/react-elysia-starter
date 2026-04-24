import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IGlobalStateType, IStateType } from './types';

// When empty, use relative path so verify-email link works from same host (e.g. ngrok).
const initData: IStateType = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  token: '',
  adminToken: '',
  user: null,
  permissions: [],
  collapsed: false,
  hydrated: false,
};

export const useGlobal = create<IGlobalStateType>()(
  persist(
    (set) => ({
      ...initData,

      actions: {
        set,
        // Preserve `hydrated` across resets: once the app has booted, a
        // logout/reset should not revert us to the "pre-hydration" state
        // (which would re-trigger the full-screen AuthGate loading).
        reset: (state) =>
          set((prev) => ({
            ...initData,
            hydrated: prev.hydrated,
            ...state,
          })),
      },
    }),
    // Persistent configuration(localStorage)
    {
      name: 'project-name',
      partialize: ({ token, adminToken, collapsed }) => ({
        token,
        adminToken,
        collapsed,
      }),
    },
  ),
);
