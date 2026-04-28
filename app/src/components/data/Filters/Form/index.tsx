import { Form, type FormProps } from "antd";

type TableFormProps<T> = {
	setFilter: React.Dispatch<React.SetStateAction<T | any>>;
	children: React.ReactNode;
} & Omit<FormProps, "onValuesChange">;

export const TableForm = <T extends Record<string, any>>({
	setFilter,
	children,
	...rest
}: TableFormProps<T>) => {
	const [form] = Form.useForm<T>();

	return (
		<Form
			form={form}
			layout="vertical"
			onValuesChange={(_changed, allValues) => {
				setFilter((prev: T) => ({
					...prev,
					...allValues,
					offset: 0,
				}));
			}}
			{...rest}
		>
			{children}
		</Form>
	);
};
