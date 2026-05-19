import { useContext } from 'react';
import { AuthContext } from '@/providers/Auth';
import type { IAuthContext } from '@/providers/Auth';

export type { IAuthContext };

export const useAuth = (): IAuthContext => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};
