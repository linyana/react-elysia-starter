import { useEffect } from "react";
import { API } from "@/libs";
import { useAPI } from "@/hooks";
import { Card } from "antd";

export const Dashboard = () => {
	const { data: projects, fetch } = useAPI(API.projects.get, {
		showLoading: false,
	});

	useEffect(() => {
		fetch();
	}, []);

	return <Card>Dashboard</Card>;
};
