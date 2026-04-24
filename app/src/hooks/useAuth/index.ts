import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '@/libs';
import { useAPI } from '@/hooks/useAPI';
import { useGlobal } from '@/hooks/useGlobal';
import { useMessage } from '@/hooks/useMessage';

/**
 * Per-mode configuration. The app supports two independent authentication
 * namespaces — the end-user app and the admin console — each with its own
 * token slot, login URL, and post-login landing. The mode is derived from
 * the current pathname so `useAuth` automatically targets the correct
 * namespace wherever it is called from.
 */
const CONFIG = {
  admin: {
    tokenKey: 'adminToken',
    loginUrl: '/admin/login',
    dashboardUrl: '/admin/dashboard',
  },
  user: {
    tokenKey: 'token',
    loginUrl: '/login',
    dashboardUrl: '/dashboard',
  },
} as const;

type IAuthMode = keyof typeof CONFIG;
type ICredentials = { email: string; password: string };

const resolveMode = (pathname: string): IAuthMode =>
  pathname.startsWith('/admin') ? 'admin' : 'user';

/**
 * useAuth — the single source of truth for session operations.
 *
 * All HTTP work is composed through `useAPI` (project rule). `login` is
 * atomic: it chains `/auth/login` + `/auth/me` before navigating, so the
 * post-login page renders its final UI on first paint — no loading
 * flash between `/login` and `/dashboard`.
 *
 * The hook is mode-aware: on `/admin/**` it targets the admin token slot
 * and URLs; elsewhere it targets the user slot. `useLocation()` keeps the
 * mode reactive to navigation.
 */
export const useAuth = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const message = useMessage();
  const global = useGlobal();

  const mode = resolveMode(pathname);
  const current = CONFIG[mode];

  const token = global[current.tokenKey];
  const user = global.user;
  const isAuthenticated = Boolean(token && user);

  // ── HTTP edges (all calls go through useAPI) ──────────────────────────
  // Login: suppress the useAPI toast — `login()` below drives a single
  // lifecycle toast ("Signing in..." → "Welcome back.") across both calls.
  const loginApi = useAPI(API.auth.login.post, {
    showLoading: false,
    success: { message: null },
    error: { message: null },
  });

  const meApi = useAPI(API.auth.me.get, {
    showLoading: false,
    success: { message: null },
    error: { message: null },
  });

  const reloadUser = async () => {
    const res = await meApi.fetch();
    if (!res) {
      global.actions.set({ [current.tokenKey]: '', user: null });
      return;
    }
    global.actions.set({
      user: { name: res.user.name, email: res.user.email },
    });
  };

  const logout = (params?: { message?: string | null }) => {
    const {
      message: warningMessage = "You've been signed out. Please log in again.",
    } = params ?? {};

    global.actions.set({ [current.tokenKey]: '', user: null });
    navigate(current.loginUrl, { replace: true });

    if (warningMessage) message.warning(warningMessage);
  };

  return {
    // state
    mode,
    isAdmin: mode === 'admin',
    token,
    user,
    isAuthenticated,

    // urls
    loginUrl: current.loginUrl,
    dashboardUrl: current.dashboardUrl,

    // verbs
    reloadUser,
    logout,

    // ui flags
    loginLoading: loginApi.loading || meApi.loading,
  };
};
