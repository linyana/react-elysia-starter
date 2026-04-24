import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks';
import type { IRouteAccessType, IRouteType } from '@/types';

export * from './Gate';

/**
 * AuthProvider — per-route, **purely synchronous** access guard.
 *
 * This component makes no network calls, holds no state, schedules no
 * effects. It inspects the current session (already hydrated by
 * `AuthGate` further up the tree) against the route's declared
 * `handle.access` semantics and either renders the children or returns
 * a `<Navigate>`.
 *
 * Contract:
 *   - `AuthGate` is mounted above this component, so by the time we
 *     run, `user` is either present or definitively absent. There is
 *     no "token without user" transient state to worry about here.
 *
 * Behavior matrix:
 *   access='public'        → render
 *   access='guest'         → render when signed-out; redirect to
 *                            dashboard when signed-in
 *   access='authenticated' → render when signed-in; redirect to
 *                            login when signed-out (preserves `from`)
 *
 * Default (no `access` set) is `'authenticated'` — safe by default.
 */
export const AuthProvider: React.FC<{
  route: IRouteType;
  children: React.ReactNode;
}> = ({ route, children }) => {
  const location = useLocation();
  const { isAuthenticated, loginUrl, dashboardUrl } = useAuth();

  const access: IRouteAccessType = route?.handle?.access ?? 'authenticated';

  if (access === 'public') return <>{children}</>;

  if (access === 'guest') {
    if (isAuthenticated) return <Navigate to={dashboardUrl} replace />;
    return <>{children}</>;
  }

  // access === 'authenticated'
  if (!isAuthenticated) {
    return (
      <Navigate to={loginUrl} replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
};
