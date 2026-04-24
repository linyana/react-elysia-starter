// import type { PERMISSION } from '@constants';
import type { RouteObject } from 'react-router-dom';
import { icons } from 'lucide-react';

export type ILayoutType = 'DEFAULT' | 'BLANK' | 'CENTERED' | 'BASIC';
export type IMenuPositionType = 'TOP' | 'BOTTOM';

/**
 * Route access semantics.
 * - `authenticated` (default): requires a valid session; anonymous users are redirected to /login.
 * - `guest`: only reachable while logged out (e.g. /login, /register). Logged-in users are bounced to the post-login landing.
 * - `public`: reachable in any state (marketing pages, legal, health checks).
 */
export type IRouteAccessType = 'authenticated' | 'guest' | 'public';

export type IMenuType = {
  position?: IMenuPositionType;
  label?: React.ReactNode;
  iconName?: keyof typeof icons;
};

export type IRouteType = Omit<RouteObject, 'children' | 'handle' | 'id'> & {
  id: string;
  handle?: {
    menu?: IMenuType;
    layout?: ILayoutType;
    access?: IRouteAccessType;
    // permissions?: PERMISSION[];
  };
  children?: IRouteType[];
};
