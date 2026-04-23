import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { GlobalLoading } from "@/components";
import { useAPI, useGlobal } from "@/hooks";
import type { IRouteType } from "@/types";
import { API } from "@/libs";

export const AuthProvider: React.FC<{
	route: IRouteType;
	children: React.ReactNode;
}> = ({ route, children }) => {
	const location = useLocation();
	const { token, user, actions } = useGlobal();
	const authRequired = route?.handle?.auth !== false;

	const {
		fetchData: fetchMe,
		loading,
		errorMessage,
	} = useAPI(API.auth.me.get, {
		showLoading: false,
		error: { message: null },
		success: {
			message: null,
			action: ({ user: me }) => {
				actions.set({ user: { name: me.name, email: me.email } });
			},
		},
	});

	useEffect(() => {
		if (token && !user) {
			fetchMe();
		}
	}, [token, user]);

	useEffect(() => {
		if (errorMessage) {
			actions.set({ token: "", user: null });
		}
	}, [errorMessage]);

	if (!authRequired) return <>{children}</>;

	if (!token) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	if (!user || loading) {
		return <GlobalLoading />;
	}

	return <>{children}</>;
};
