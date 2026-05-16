import { ProButton, ProForm, ProModal } from '@/components';
import { useAPI } from '@/hooks';
import { API } from '@/libs';
import { ICreateUserRequestType } from '@api/core/users/types';
import { Form, Input } from 'antd';
import { useState } from 'react';

type IPropsType = {
	fetch: () => void;
};

const initial: ICreateUserRequestType = { name: '', email: '', password: '' };

export const CreateUser = ({ fetch }: IPropsType) => {
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm<ICreateUserRequestType>();

	const { fetch: createUser, loading } = useAPI({
		fetcher: API.users.post,
		success: {
			message: 'User created',
			action: () => {
				setOpen(false);
				form.resetFields();
				fetch();
			},
		},
	});

	const handleOpen = () => {
		setOpen(true);
	};

	return (
		<>
			<ProButton
				type="primary"
				iconName="Plus"
				onClick={handleOpen}
			>
				Create User
			</ProButton>
			<ProModal
				title="Create User"
				open={open}
				onCancel={() => setOpen(false)}
				footer={null}
			>
				<ProForm
					form={form}
					initial={initial}
					onCancel={() => setOpen(false)}
					onSubmit={createUser}
					submitButton={{ loading, children: "Create", iconName: "Plus" }}
				>
					<Form.Item
						name="name"
						label="Name"
						rules={[{ required: true, message: "Name is required" }]}
					>
						<Input placeholder="Jane Doe" />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{ required: true, message: "Email is required" },
							{ type: "email", message: "Invalid email" },
						]}
					>
						<Input placeholder="jane@example.com" />
					</Form.Item>
					<Form.Item
						name="password"
						label="Password"
						rules={[
							{ required: true, message: "Password is required" },
							{ min: 8, message: "At least 8 characters" },
						]}
					>
						<Input.Password placeholder="••••••••" />
					</Form.Item>
				</ProForm>
			</ProModal>
		</>
	);
};
