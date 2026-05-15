import { Button, Flex, Form } from 'antd';
import type { FormInstance } from 'antd';

type IPropsType<T extends Record<string, unknown>> = {
	form: FormInstance<T>;
	initial: Partial<T>;
	onCancel: () => void;
	onSubmit: (values: T) => unknown;
	loading?: boolean;
	cancelText?: string;
	submitText?: string;
};

export const FormActions = <T extends Record<string, unknown>>({
	form,
	initial,
	onCancel,
	onSubmit,
	loading,
	cancelText = 'Cancel',
	submitText = 'Save',
}: IPropsType<T>) => {
	const values = Form.useWatch([], form);

	const dirty =
		!!values &&
		(Object.keys(initial) as Array<keyof T>).some(
			(key) => values[key] !== initial[key],
		);

	const hasErrors = form
		.getFieldsError()
		.some(({ errors }) => errors.length > 0);

	const handleSubmit = async () => {
		let valid: T;
		try {
			valid = await form.validateFields();
		} catch {
			return;
		}
		await onSubmit(valid);
	};

	return (
		<Flex justify="end" gap="small">
			<Button onClick={onCancel}>{cancelText}</Button>
			<Button
				type="primary"
				loading={loading}
				disabled={!dirty || hasErrors}
				onClick={handleSubmit}
			>
				{submitText}
			</Button>
		</Flex>
	);
};
