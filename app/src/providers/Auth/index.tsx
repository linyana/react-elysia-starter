import React from 'react';
import type { IRouteType } from '@/types';

export const AuthProvider: React.FC<{
  route: IRouteType;
  children: React.ReactNode;
}> = ({ children }) => {
  // TODO: Implement authentication logic (token check, redirect, permission fetch)
  return <>{children}</>;
};
