import { useLocation, useNavigate } from "react-router-dom";
import { API } from "@/libs";
import { useAPI } from "@/hooks/useAPI";
import { useGlobal } from "@/hooks/useGlobal";
import { useMessage } from "@/hooks/useMessage";
import { useEffect, useState } from "react";

/**
 * Per-mode configuration. The app supports two independent authentication
 * namespaces — the end-user app and the admin console — each with its own
 * token slot, login URL, and post-login landing. The mode is derived from
 * the current pathname so `useAuth` automatically targets the correct
 * namespace wherever it is called from.
 */
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

type IStatusType = "WAITING" | "FETCHING" | "COMPLETE" | "ERROR";

export const useAuth = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const message = useMessage();
	const global = useGlobal();

	const [status, setStatus] = useState<IStatusType>("WAITING");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

	const { fetch } = useAPI(API.auth.me.get, {
		showLoading: false,
		success: {
			message: null,
			action: () => {
				setStatus("COMPLETE");
				setIsAuthenticated(true);
			},
		},
		error: {
			message: null,
			action: () => {
				setStatus("ERROR");
				setIsAuthenticated(false);
			},
		},
	});

	useEffect(() => {
		if (status === "WAITING") {
			fetch();
			setStatus("FETCHING");
		}
	}, [status]);

	const mode = resolveMode(pathname);
	const current = CONFIG[mode];

	const token = global[current.tokenKey];
	const user = global.user;

	const reloadUser = async () => {
		// const res = await meApi.fetch();
		// if (!res) {
		//   global.actions.set({ [current.tokenKey]: '', user: null });
		//   return;
		// }
		// global.actions.set({
		//   user: { name: res.user.name, email: res.user.email },
		// });
	};

	const logout = (params?: { message?: string | null }) => {
		const {
			message: warningMessage = "You've been signed out. Please log in again.",
		} = params ?? {};

		global.actions.set({ [current.tokenKey]: "", user: null });
		navigate(current.loginUrl, { replace: true });

		if (warningMessage) message.warning(warningMessage);
	};

	return {
		// state
		mode,
		isAdmin: mode === "admin",
		token,
		user,
		isAuthenticated,
		status,

		// urls
		loginUrl: current.loginUrl,
		dashboardUrl: current.dashboardUrl,

		// verbs
		logout,
	};
};
