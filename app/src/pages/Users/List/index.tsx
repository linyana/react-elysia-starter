import { TableForm, ProCard, ProTable, SearchInput } from "@/components";
import { useListAPI } from "@/hooks";
import { API } from "@/libs";
import { CreateUser } from "../Create";
import { useUserColumns } from "./columns";

export const UserList = () => {
	const { data, pagination, loading, setFilter, fetch } = useListAPI(
		API.users.get,
	);

	const columns = useUserColumns({ fetch });

	return (
		<ProCard
			title="User List"
			iconName="Users"
			extra={<CreateUser fetch={fetch} />}
		>
			<TableForm setFilter={setFilter}>
				<SearchInput placeholder="Search by name or email" />
			</TableForm>
			<ProTable
				columns={columns}
				dataSource={data}
				loading={loading}
				pagination={pagination}
				setFilter={setFilter}
				rowKey="id"
			/>
		</ProCard>
	);
};
