import type { IRouteType } from "@/types";
import { Dashboard, Login, Placeholder } from "./pages";

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
			},
		},
	},
	{
		id: "/projects",
		path: "/projects",
		element: <Placeholder title="Projects" />,
		handle: {
			menu: {
				label: "Projects",
				iconName: "FolderKanban",
			},
		},
	},
	{
		id: "/tasks",
		path: "/tasks",
		element: <Placeholder title="Tasks" />,
		handle: {
			menu: {
				label: "Tasks",
				iconName: "ListChecks",
			},
		},
	},
	{
		id: "/team",
		path: "/team",
		element: <Placeholder title="Team" />,
		handle: {
			menu: {
				label: "Team",
				iconName: "Users",
			},
		},
	},
	{
		id: "/analytics",
		path: "/analytics",
		element: <Placeholder title="Analytics" />,
		handle: {
			menu: {
				label: "Analytics",
				iconName: "ChartLine",
			},
		},
	},
	{
		id: "/messages",
		path: "/messages",
		element: <Placeholder title="Messages" />,
		handle: {
			menu: {
				label: "Messages",
				iconName: "MessageSquare",
			},
		},
	},
	{
		id: "/settings",
		path: "/settings",
		element: <Placeholder title="Settings" />,
		handle: {
			menu: {
				label: "Settings",
				iconName: "Settings",
				position: "BOTTOM",
			},
		},
	},
	{
		id: "/help",
		path: "/help",
		element: <Placeholder title="Help & Support" />,
		handle: {
			menu: {
				label: "Help",
				iconName: "Helicopter",
				position: "BOTTOM",
			},
		},
	},
	{
		id: "not-found",
		path: "*",
		element: <NotFound />,
	},
];
