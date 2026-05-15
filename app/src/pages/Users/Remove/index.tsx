import { ProButton, ProModal } from '@/components';
import { useAPI } from '@/hooks';
import type { UseAPIData } from '@/hooks/useAPI';
import { API } from '@/libs';
import { useState } from 'react';

type IUser = UseAPIData<typeof API.users.get>['items'][number];

type IPropsType = {
	fetch: () => void;
	items: IUser[];
};

export const RemoveUser = ({ fetch, items }: IPropsType) => {
	const [open, setOpen] = useState<boolean>(false);
	const { fetch: removeUser } = useAPI({
		fetcher: () =>
			API.users.delete({
				ids: items.map((item) => String(item.id)),
			}),
		success: {
			action: fetch,
		},
	});

	return (
		<>
			<ProButton
				action="DELETE"
				onClick={() => {
					setOpen(true);
				}}
			/>
			<ProModal
				title="Delete this user?"
				okText="Confirm"
				onCancel={() => {
					setOpen(false);
				}}
				onOk={() => {
					removeUser();
					setOpen(false);
				}}
				okButtonProps={{ danger: true }}
				open={open}
			>
				Are you sure you want to delete this user?
			</ProModal>
		</>
	);
};
