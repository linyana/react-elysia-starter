import { FilterForm, ProCard, ProTable, SearchInput } from "@/components";
import { useListAPI } from "@/hooks";
import { API } from "@/libs";
import { CreateUser } from "../Create";
import { useUserColumns } from "./columns";

export const UserList = () => {
  const { dataSource, pagination, loading, setFilter, refetch } = useListAPI(
    API.users.get,
  );

  const columns = useUserColumns({ refetch });

  return (
    <ProCard
      title="User List"
      iconName="Users"
      extra={<CreateUser refetch={refetch} />}
    >
      <FilterForm setFilter={setFilter}>
        <SearchInput placeholder="Search by name or email" />
      </FilterForm>
      <ProTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        setFilter={setFilter}
        rowKey="id"
      />
    </ProCard>
  );
};
