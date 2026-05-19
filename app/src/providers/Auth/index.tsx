import { createContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAPI } from '@/hooks/useAPI';
import { useGlobal } from '@/hooks/useGlobal';
import { useMessage } from '@/hooks/useMessage';
import { API } from '@/libs';
import { ErrorPage, GlobalLoading } from '@/components';
import type { IRouteAccessType, IRouteType } from '@/types';

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

const resolveMode = (pathname: string): IAuthMode =>
	pathname.startsWith('/admin') ? 'admin' : 'user';

type IStatusType =
	| 'WAITING'
	| 'FETCHING'
	| 'AUTHENTICATED'
	| 'UNAUTHENTICATED'
	| 'ERROR';

export type IAuthContext = {
	status: IStatusType;
	loginUrl: string;
	dashboardUrl: string;
	logout: (params?: { message?: string | null }) => void;
};

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<{
	route: IRouteType;
	children: React.ReactNode;
}> = ({ route, children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const msg = useMessage();
	const { token, actions } = useGlobal();

	const [status, setStatus] = useState<IStatusType>('WAITING');
	const [httpError, setHttpError] = useState<number>(500);

	const mode = resolveMode(location.pathname);
	const current = CONFIG[mode];

	const { fetch } = useAPI({
		fetcher: API.auth.me.get,
		showLoading: false,
		success: {
			message: null,
			action: ({ user }) => {
				actions.set({
					user: { name: user.name, email: user.email },
				});
				setStatus('AUTHENTICATED');
			},
		},
		error: {
			message: null,
			action: (_msg, httpStatus) => {
				if (httpStatus === 401) {
					actions.set({ [current.tokenKey]: '', user: null });
				} else {
					setHttpError(httpStatus ?? 500);
					setStatus('ERROR');
				}
			},
		},
	});

	useEffect(() => {
		setStatus('WAITING');
	}, [token]);

	useEffect(() => {
		if (!token) {
			setStatus('UNAUTHENTICATED');
			return;
		}
		if (status === 'WAITING') {
			fetch();
			setStatus('FETCHING');
		}
	}, [status]);

	const logout = (params?: { message?: string | null }) => {
		const {
			message:
				warningMessage = "You've been signed out. Please log in again.",
		} = params ?? {};

		actions.set({ [current.tokenKey]: '', user: null });
		navigate(current.loginUrl, { replace: true });

		if (warningMessage) msg.warning(warningMessage);
	};

	const value = useMemo<IAuthContext>(
		() => ({
			status,
			loginUrl: current.loginUrl,
			dashboardUrl: current.dashboardUrl,
			logout,
		}),
		[status, current.loginUrl, current.dashboardUrl],
	);

	const access: IRouteAccessType = route?.handle?.access ?? 'AUTHENTICATED';

	const wrap = (node: React.ReactNode) => (
		<AuthContext.Provider value={value}>{node}</AuthContext.Provider>
	);

	if (access === 'PUBLIC') return wrap(children);

	if (status === 'ERROR') return <ErrorPage status={httpError} />;

	if (!['AUTHENTICATED', 'UNAUTHENTICATED'].includes(status))
		return <GlobalLoading />;

	if (access === 'GUEST') {
		if (status === 'AUTHENTICATED')
			return <Navigate to={current.dashboardUrl} replace />;
		return wrap(children);
	}

	if (status === 'UNAUTHENTICATED') {
		return (
			<Navigate
				to={current.loginUrl}
				replace
				state={{ from: location.pathname }}
			/>
		);
	}

	return wrap(children);
};
