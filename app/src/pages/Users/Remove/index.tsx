import { ProButton, ProModal } from '@/components';
import { useAPI } from '@/hooks';
import type { UseAPIItem } from '@/hooks/useAPI';
import { API } from '@/libs';
import { useState } from 'react';

type IPropsType = {
	refreshList: () => void;
	items: UseAPIItem<typeof API.users.get>[];
};

export const RemoveUser = ({ refreshList, items }: IPropsType) => {
	const [open, setOpen] = useState<boolean>(false);
	const { fetch: removeUser } = useAPI({
		fetcher: () =>
			API.users.delete({
				ids: items.map((item) => String(item.id)),
			}),
		success: {
			action: () => {
				setOpen(false)
				refreshList()
			},
		},
	});

	const single = items.length === 1 ? items[0] : null;
	const content = single
		? {
				title: `Delete user "${single.name}"?`,
				body: (
					<>
						Are you sure you want to delete <strong>{single.name}</strong> (
						{single.email})? This action cannot be undone.
					</>
				),
			}
		: {
				title: `Delete ${items.length} users?`,
				body: (
					<>
						Are you sure you want to delete these{" "}
						<strong>{items.length}</strong> users? This action cannot be undone.
					</>
				),
			};

	return (
		<>
			<ProButton
				type="text"
				action="DELETE"
				onClick={() => {
					setOpen(true);
				}}
			/>
			<ProModal
				title={content.title}
				okText="Confirm"
				onCancel={() => {
					setOpen(false);
				}}
				onOk={() => {
					removeUser();
				}}
				okButtonProps={{ danger: true }}
				open={open}
			>
				{content.body}
			</ProModal>
		</>
	);
};
