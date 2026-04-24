import { useEffect, useRef } from 'react';
import { GlobalLoading } from '@/components';
import { useAPI, useGlobal } from '@/hooks';
import { API } from '@/libs';

/**
 * AuthGate — app-level, one-shot hydration gate.
 *
 * Renders a full-screen `<GlobalLoading />` until the auth state is
 * "definitively known" for this page load:
 *   - No token in storage?        → mark hydrated immediately.
 *   - Token but no profile yet?   → call `/auth/me` once (via `useAPI`,
 *                                    per project rule), then mark hydrated.
 *
 * After `hydrated === true`, this component is effectively a pass-through
 * for the rest of the session. Subsequent sign-in / sign-out never flip
 * `hydrated` back to false (see `useGlobal.actions.reset`), so the loading
 * screen shows **at most once per page load** — exclusively on first paint.
 *
 * Why at the app root instead of inside the layout?
 *   If this lived inside `LayoutProvider`, the layout shell (sidebar, header)
 *   would render around the loading spinner on refresh, causing a visible
 *   flash of chrome before the real page. Gating above the router guarantees
 *   the loading screen is fullscreen and chrome-free.
 */
export const AuthGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, hydrated, actions } = useGlobal();
  const started = useRef(false);

  const meApi = useAPI(API.auth.me.get, {
    showLoading: false,
    success: { message: null },
    error: { message: null },
  });

  useEffect(() => {
    if (hydrated || started.current) return;
    started.current = true;

    if (!token) {
      actions.set({ hydrated: true });
      return;
    }

    (async () => {
      const res = await meApi.fetchData();
      if (!res) {
        // Stale / invalid token → drop it so the app treats the visitor
        // as anonymous. Single `set` keeps this one commit.
        actions.set({
          token: '',
          adminToken: '',
          user: null,
          hydrated: true,
        });
        return;
      }
      actions.set({
        user: { name: res.user.name, email: res.user.email },
        hydrated: true,
      });
    })();
    // meApi identity is stable enough; we only care to run this once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, token, actions]);

  if (!hydrated) return <GlobalLoading />;
  return <>{children}</>;
};
