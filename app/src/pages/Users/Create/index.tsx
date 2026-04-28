import { useState } from "react";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { Plus } from "lucide-react";
import { useAPI } from "@/hooks";
import { API } from "@/libs";

type IPropsType = {
	fetch: () => void;
};

type ICreateUserForm = {
	tenantId: number;
	name: string;
	email: string;
	password: string;
};

export const CreateUser = ({ fetch }: IPropsType) => {
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm<ICreateUserForm>();

	const { fetch: createUser, loading } = useAPI(API.users.post, {
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
					<Form.Item
						name="tenantId"
						label="Tenant ID"
						rules={[{ required: true, message: "Tenant ID is required" }]}
					>
						<InputNumber style={{ width: "100%" }} min={1} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};
