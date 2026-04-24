import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import type { IRouteAccessType, IRouteType } from "@/types";

export const AuthProvider: React.FC<{
	route: IRouteType;
	children: React.ReactNode;
}> = ({ route, children }) => {
	const location = useLocation();
	const { isAuthenticated, loginUrl, dashboardUrl, token } = useAuth();

	const access: IRouteAccessType = route?.handle?.access ?? "AUTHENTICATED";
	
	console.log(token)

	if (access === "PUBLIC") return <>{children}</>;

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
