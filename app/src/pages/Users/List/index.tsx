import { TableForm, ProCard, ProTable, SearchInput } from "@/components";
import { useListAPI } from "@/hooks";
import { API } from "@/libs";
import { CreateUser } from "../Create";
import { RemoveUser } from "../Remove";

export const UserList = () => {
	const { data, pagination, loading, setFilter, fetch } = useListAPI({
		fetcher: API.users.get,
	});

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
				columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Email", dataIndex: "email", key: "email" },
          {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => new Date(text).toLocaleString(),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <RemoveUser record={record} fetch={fetch} />
            ),
          },
        ]}
				dataSource={data}
				loading={loading}
				pagination={pagination}
				setFilter={setFilter}
				rowKey="id"
			/>
		</ProCard>
	);
};
