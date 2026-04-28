import { useGlobal } from "@/hooks";
import { hasAllPermissions } from "@/utils";
import type { IPaginationType } from "@api/types";
import { Table, Typography, type TableProps } from "antd";
import { IColumnsType } from "./types";

export * from "./types";

type IPropsType<T> = Omit<TableProps<T>, "columns"> & {
	selectedProps?: {
		length?: number;
	};
	setFilter: React.Dispatch<React.SetStateAction<any>>;
	pagination: IPaginationType;
	columns: IColumnsType<T>;
};

const { Paragraph } = Typography;

export const ProTable = <T extends object>({
	setFilter,
	pagination,
	selectedProps,
	columns: rawColumns,
	...props
}: IPropsType<T>) => {
	const { permissions = [] } = useGlobal();

	const columns = rawColumns.filter((column) =>
		hasAllPermissions(permissions, column.permissions || []),
	);

	const { totalCount, offset, limit } = pagination;
	const start = totalCount === 0 ? 0 : offset + 1;
	const end = Math.min(offset + limit, totalCount);

	return (
		<>
			{selectedProps?.length ? (
				<Paragraph
					style={{
						marginTop: 8,
						marginBottom: 0,
					}}
				>
					{`${selectedProps?.length} item${selectedProps?.length === 1 ? "" : "s"} selected`}
				</Paragraph>
			) : (
				<></>
			)}
			<Table<T>
				onChange={({ current = 1, pageSize = 10 }, _filter, sorter: any) => {
					const orderMap: Record<string, "asc" | "desc" | undefined> = {
						ascend: "asc",
						descend: "desc",
					};
					setFilter((prev: any) => ({
						...prev,
						sortBy: sorter.field,
						orderBy: orderMap[sorter?.order as string],
						offset: (current - 1) * pageSize,
						limit: pageSize,
					}));
				}}
				rowKey="id"
				scroll={{
					x: true,
				}}
				{...props}
				pagination={{
					total: totalCount,
					pageSize: limit,
					current: Math.floor(offset / limit) + 1,
					showSizeChanger: true,
					showTotal: () => `Showing ${start} - ${end} from ${totalCount} items`,
					showQuickJumper: true,
				}}
				columns={columns}
			/>
		</>
	);
};
