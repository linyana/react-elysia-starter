import { LucideIcon } from '@/components';
import { useAPI } from '@/hooks';
import type { UseAPIData } from '@/hooks/useAPI';
import { API } from '@/libs';
import { Button, Popconfirm } from 'antd';

type IUser = UseAPIData<typeof API.users.get>['items'][number];

type IPropsType = {
	fetch: () => void;
	items: IUser[];
	shape: 'Popconfirm' | 'Modal';
};

export const RemoveUser = ({ fetch, items, shape = 'Modal' }: IPropsType) => {
	const { fetch: removeUser } = useAPI({
		fetcher: () =>
			API.users.delete({
				ids: items.map((item) => String(item.id)),
			}),
		success: { message: 'Successfully removed this user', action: fetch },
	});

	return (
		<Popconfirm
			title="Delete this user?"
			okText="Delete"
			okButtonProps={{ danger: true }}
			onConfirm={() => {
				removeUser();
			}}
		>
			<Button type="text" danger icon={<LucideIcon name="Trash2" />} />
		</Popconfirm>
	);
};
