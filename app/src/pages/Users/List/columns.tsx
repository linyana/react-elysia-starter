import { Button, Popconfirm } from "antd";
import { useAPI } from "@/hooks";
import { useColumns } from "@/hooks/useColumns";
import { API } from "@/libs";
import type { UseAPIData } from "@/hooks/useAPI";
import { LucideIcon } from "@/components";

type IPropsType = {
	refetch: () => void;
};

export const useUserColumns = ({ refetch }: IPropsType) => {
	const { fetch: deleteUser } = useAPI(
		(id: number) => API.users({ id }).delete(),
		{ success: { message: "User deleted", action: refetch } },
	);

	return useColumns<UseAPIData<typeof API.users.get>["items"][number]>({
		columns: [
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
				width: 120,
				render: (_, record) => (
					<Popconfirm
						title="Delete this user?"
						okText="Delete"
						okButtonProps={{ danger: true }}
						onConfirm={() => deleteUser(record.id)}
					>
						<Button size="small" type="text" danger icon={<LucideIcon name="Trash2" />} />
					</Popconfirm>
				),
			},
		],
	});
};
