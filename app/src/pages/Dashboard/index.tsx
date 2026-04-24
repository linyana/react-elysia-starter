import { useEffect } from "react";
import { API } from "@/libs";
import { useAPI } from "@/hooks";

export const Dashboard = () => {
	const { data: projects, fetch } = useAPI(API.projects.get, {
		showLoading: false,
	});

	useEffect(() => {
		fetch();
	}, []);

	return <div>Dashboard</div>;
};
