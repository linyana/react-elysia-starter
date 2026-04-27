import { useLocation, useNavigate } from "react-router-dom";
import { API } from "@/libs";
import { useAPI } from "@/hooks/useAPI";
import { useGlobal } from "@/hooks/useGlobal";
import { useMessage } from "@/hooks/useMessage";
import { useEffect, useState } from "react";

const CONFIG = {
	admin: {
		tokenKey: "adminToken",
		loginUrl: "/admin/login",
		dashboardUrl: "/admin/dashboard",
	},
	user: {
		tokenKey: "token",
		loginUrl: "/login",
		dashboardUrl: "/dashboard",
	},
} as const;

type IAuthMode = keyof typeof CONFIG;

const resolveMode = (pathname: string): IAuthMode =>
	pathname.startsWith("/admin") ? "admin" : "user";

type IStatusType =
	| "WAITING"
	| "FETCHING"
	| "AUTHENTICATED"
	| "UNAUTHENTICATED"
	| "ERROR";

export const useAuth = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const message = useMessage();
	const { token, actions } = useGlobal();

	const [status, setStatus] = useState<IStatusType>("WAITING");

	const mode = resolveMode(pathname);
	const current = CONFIG[mode];

	const { fetch } = useAPI(API.auth.me.get, {
		showLoading: false,
		success: {
			message: null,
			action: ({ user }) => {
				actions.set({
					user: {
						name: user.name,
						email: user.email,
					},
				});
				setStatus("AUTHENTICATED");
			},
		},
		error: {
			message: null,
			action: (_msg, httpStatus) => {
				if (httpStatus === 401) {
					actions.set({ [current.tokenKey]: "", user: null });
				} else {
					setStatus("ERROR");
				}
			},
		},
	});

	useEffect(() => {
		setStatus("WAITING");
	}, [token]);

	useEffect(() => {
		if (!token) {
			setStatus("UNAUTHENTICATED");
			return;
		}
		if (status === "WAITING") {
			fetch();
			setStatus("FETCHING");
		}
	}, [status]);

	const logout = (params?: { message?: string | null }) => {
		const {
			message: warningMessage = "You've been signed out. Please log in again.",
		} = params ?? {};

		actions.set({ [current.tokenKey]: "", user: null });
		navigate(current.loginUrl, { replace: true });

		if (warningMessage) message.warning(warningMessage);
	};

	return {
		// state
		status,

		// urls
		loginUrl: current.loginUrl,
		dashboardUrl: current.dashboardUrl,

		// verbs
		logout,
	};
};
