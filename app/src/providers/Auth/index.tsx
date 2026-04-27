import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import type { IRouteAccessType, IRouteType } from "@/types";
import { GlobalLoading } from "@/components";

export const AuthProvider: React.FC<{
	route: IRouteType;
	children: React.ReactNode;
}> = ({ route, children }) => {
	const location = useLocation();

	const access: IRouteAccessType = route?.handle?.access ?? "AUTHENTICATED";

	if (access === "PUBLIC") return <>{children}</>;

	const { loginUrl, dashboardUrl, status } = useAuth();

	if (status === "ERROR") return <div>Something went wrong</div>;

	if (!["AUTHENTICATED", "UNAUTHENTICATED"].includes(status)) return <GlobalLoading />;

	if (access === "GUEST") {
		if (status === "AUTHENTICATED") return <Navigate to={dashboardUrl} replace />;
		return <>{children}</>;
	}

	// access === 'AUTHENTICATED'
	if (status === "UNAUTHENTICATED") {
		return (
			<Navigate to={loginUrl} replace state={{ from: location.pathname }} />
		);
	}

	return <>{children}</>;
};
