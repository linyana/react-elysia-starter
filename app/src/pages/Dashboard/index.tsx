import { useEffect } from "react";
import { API } from "@/libs";
import { useAPI } from "@/hooks";

export const Dashboard = () => {
	const { data: projects, fetchData } = useAPI(API.projects.get, {
		showLoading: false,
	});

	useEffect(() => {
		fetchData();
	}, []);

	return <div>Dashboard</div>;
};
