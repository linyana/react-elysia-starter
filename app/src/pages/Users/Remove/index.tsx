import { LucideIcon } from "@/components";
import { useAPI } from "@/hooks";
import type { UseAPIData } from "@/hooks/useAPI";
import { API } from "@/libs";
import { Button, Popconfirm } from "antd";

type IUser = UseAPIData<typeof API.users.get>["items"][number];

type IPropsType = {
	fetch: () => void;
	record: IUser;
};

export const RemoveUser = ({ fetch, record }: IPropsType) => {
	const { fetch: deleteUser } = useAPI(
		(id: number) => API.users({ id }).delete(),
		{ success: { message: "User deleted", action: fetch } },
	);

	return (
		<Popconfirm
			title="Delete this user?"
			okText="Delete"
			okButtonProps={{ danger: true }}
			onConfirm={() => deleteUser(record.id)}
		>
			<Button
				size="small"
				type="text"
				danger
				icon={<LucideIcon name="Trash2" />}
			/>
		</Popconfirm>
	);
};
