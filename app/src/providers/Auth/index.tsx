import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import type { IRouteAccessType, IRouteType } from "@/types";
import { useState } from "react";
import { GlobalLoading } from "@/components";

type IStatusType = 'COMPLETE' | 'ERROR' | null

export const AuthProvider: React.FC<{
	route: IRouteType;
	children: React.ReactNode;
}> = ({ route, children }) => {
	const location = useLocation();

	const { isAuthenticated, loginUrl, dashboardUrl, status } = useAuth();

	const access: IRouteAccessType = route?.handle?.access ?? "AUTHENTICATED";
	
	if (access === "PUBLIC") return <>{children}</>;
	
	if(status !== 'COMPLETE') return <GlobalLoading />;


	if (access === "GUEST") {
		if (isAuthenticated) return <Navigate to={dashboardUrl} replace />;
		return <>{children}</>;
	}

	// access === 'AUTHENTICATED'
	if (!isAuthenticated) {
		return (
			<Navigate to={loginUrl} replace state={{ from: location.pathname }} />
		);
	}

	return <>{children}</>;
};
