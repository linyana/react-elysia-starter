import { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { Plus } from "lucide-react";
import { useAPI } from "@/hooks";
import { API } from "@/libs";
import { ICreateUserRequestType } from "@api/core/users/types";

type IPropsType = {
	fetch: () => void;
};

export const CreateUser = ({ fetch }: IPropsType) => {
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm<ICreateUserRequestType>();

	const { fetch: createUser, loading } = useAPI({
		fetcher: API.users.post,
		success: {
			message: "User created",
			action: () => {
				setOpen(false);
				form.resetFields();
				fetch();
			},
		},
	});

	const handleSubmit = async () => {
		const values = await form.validateFields();
		await createUser(values);
	};

	return (
		<>
			<Button
				type="primary"
				icon={<Plus size={14} />}
				onClick={() => setOpen(true)}
			>
				Create User
			</Button>
			<Modal
				title="Create User"
				open={open}
				onOk={handleSubmit}
				onCancel={() => setOpen(false)}
				confirmLoading={loading}
				okText="Create"
				destroyOnHidden
				centered
			>
				<Form form={form} layout="vertical" preserve={false}>
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
				</Form>
			</Modal>
		</>
	);
};
