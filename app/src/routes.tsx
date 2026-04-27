import type { IRouteType } from "@/types";
import { Dashboard, Login, Users } from "@/pages";

const NotFound = () => {
	throw new Response("Not Found", {
		status: 404,
		statusText: "Not Found",
	});
};

export const routes: IRouteType[] = [
	{
		id: "/login",
		path: "/login",
		element: <Login />,
		handle: {
			layout: "BLANK",
			access: "GUEST",
		},
	},
	{
		id: "/dashboard",
		path: "/dashboard",
		element: <Dashboard />,
		handle: {
			menu: {
				label: "Dashboard",
				iconName: "LayoutDashboard",
				featured: true,
			},
		},
	},
	{
		id: "/users",
		path: "/users",
		element: <Users />,
		handle: {
			menu: {
				label: "Users",
				iconName: "Users",
				featured: true,
			},
		},
	},
	{
		id: "not-found",
		path: "*",
		element: <NotFound />,
	},
];
