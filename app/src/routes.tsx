import type { IRouteType } from '@/types';
import { Dashboard, Login } from './pages';

const NotFound = () => {
  throw new Response('Not Found', {
    status: 404,
    statusText: 'Not Found',
  });
};

export const routes: IRouteType[] = [
  {
    id: '/login',
    path: '/login',
    element: <Login />,
    handle: {
      layout: 'BLANK',
      auth: false,
    },
  },
  {
    id: '/dashboard',
    path: '/dashboard',
    element: <Dashboard />,
    handle: {
      menu: {
        label: 'Dashboard',
        iconName: 'LayoutDashboard',
      },
    },
  },
  {
    id: 'not-found',
    path: '*',
    element: <NotFound />,
  },
];
