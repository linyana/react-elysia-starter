import { ProButton, ProForm, ProModal } from '@/components';
import { useAPI } from '@/hooks';
import type { UseAPIItem } from '@/hooks/useAPI';
import { API } from '@/libs';
import type { IUpdateUserRequestType } from '@api/core/users/types';
import { Form, Input } from 'antd';
import { useState } from 'react';

type IPropsType = {
	item: UseAPIItem<typeof API.users.get>;
	onEdited: (id: number, patch: Partial<UseAPIItem<typeof API.users.get>>) => void;
};

export const EditUser = ({ item, onEdited }: IPropsType) => {
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm<IUpdateUserRequestType>();
	const initial = { name: item.name, email: item.email };

	const { fetch: updateUser, loading } = useAPI({
		fetcher: (body: IUpdateUserRequestType) =>
			API.users({ id: String(item.id) }).patch(body),
		success: {
			message: 'User updated',
			action: (data) => {
				if (data) onEdited(item.id, data);
				setOpen(false);
			},
		},
	});

	const handleOpen = () => {
		form.setFieldsValue(initial);
		setOpen(true);
	};

	return (
		<>
			<ProButton type="text" action="EDIT" onClick={handleOpen} />
			<ProModal
				title={`Edit user "${item.name}"`}
				open={open}
				onCancel={() => setOpen(false)}
				footer={null}
			>
				<ProForm
					form={form}
					initial={initial}
					onCancel={() => setOpen(false)}
					onSubmit={updateUser}
					submitButton={{ loading }}
				>
					<Form.Item
						name="name"
						label="Name"
						rules={[
							{ required: true, message: 'Name is required' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{ required: true, message: 'Email is required' },
							{ type: 'email', message: 'Invalid email' },
						]}
					>
						<Input />
					</Form.Item>
				</ProForm>
			</ProModal>
		</>
	);
};
