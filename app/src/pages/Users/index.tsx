import { FilterForm, ProCard, ProTable, SearchInput } from "@/components";
import { useAPI } from "@/hooks";
import { API } from "@/libs";
import { useEffect, useState } from "react";
import getColumns from './List/columns'
import { useColumns } from "@/hooks/useColumns";

export const Users = () => {
	const [filter, setFilter] = useState({
		offset: 0,
		limit: 10,
		keyword: undefined,
	});

	const { fetch, data, pagination, loading } = useAPI(API.users.get, {
		params: filter,
	});

	useEffect(() => {
		fetch();
	}, [filter]);

	const columns = useColumns({
		columns: getColumns({ onSuccess: fetch }),
	});

	return (
		<ProCard title="User List" iconName="List">
			<FilterForm setFilter={setFilter}>
				<SearchInput placeholder="Search by app name or client id" />
			</FilterForm>
			<ProTable
				columns={columns}
				dataSource={data ?? []}
				loading={loading}
				pagination={pagination}
				setFilter={setFilter}
				rowKey="id"
			/>
		</ProCard>
	);
};
