// import type { PERMISSION } from '@constants';
import type { RouteObject } from "react-router-dom";
import { icons } from "lucide-react";

export type ILayoutType = "DEFAULT" | "BLANK" | "CENTERED" | "BASIC";

/**
 * Route access semantics.
 * - `AUTHENTICATED` (default): requires a valid session; anonymous users are redirected to /login.
 * - `GUEST`: only reachable while logged out (e.g. /login, /register). Logged-in users are bounced to the post-login landing.
 * - `PUBLIC`: reachable in any state (marketing pages, legal, health checks).
 */
export type IRouteAccessType = "AUTHENTICATED" | "GUEST" | "PUBLIC";

export type IMenuType = {
	label?: React.ReactNode;
	iconName?: keyof typeof icons;
	/** Surface this route as a default suggestion in the command palette. */
	featured?: boolean;
};

export type IRouteType = Omit<RouteObject, "children" | "handle" | "id"> & {
	id: string;
	handle?: {
		menu?: IMenuType;
		layout?: ILayoutType;
		access?: IRouteAccessType;
		// permissions?: PERMISSION[];
	};
	children?: IRouteType[];
};
