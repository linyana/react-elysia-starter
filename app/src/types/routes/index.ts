// import type { PERMISSION } from '@constants';
import type { RouteObject } from 'react-router-dom';
import { icons } from 'lucide-react';

export type ILayoutType = 'DEFAULT' | 'BLANK' | 'CENTERED' | 'BASIC';
export type IMenuPositionType = 'TOP' | 'BOTTOM';

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
    auth?: boolean;
    // permissions?: PERMISSION[];
  };
  children?: IRouteType[];
};
