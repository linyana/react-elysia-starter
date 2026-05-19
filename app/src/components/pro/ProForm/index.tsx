import { ProButton } from '@/components';
import type { ProButtonProps } from '@/components';
import { Flex, Form } from 'antd';
import type { FormInstance, FormProps } from 'antd';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';

type IPropsType<T extends Record<string, unknown>> = {
	form: FormInstance<T>;
	initial: Partial<T>;
	onSubmit: (values: T) => unknown;
	onCancel: () => void;
	children: ReactNode;
	formProps?: Omit<FormProps<T>, 'form' | 'children'>;
	submitButton?: ProButtonProps;
	cancelButton?: ProButtonProps;
};

export const ProForm = <T extends Record<string, unknown>>({
	form,
	initial,
	onSubmit,
	onCancel,
	children,
	formProps,
	submitButton,
	cancelButton,
}: IPropsType<T>) => {
	const values = Form.useWatch([], form);
	const saveControls = useAnimation();
	const loading = !!submitButton?.loading;

	const dirty =
		!!values &&
		(Object.keys(initial) as Array<keyof T>).some(
			(key) => values[key] !== initial[key],
		);

	const hasErrors = form
		.getFieldsError()
		.some(({ errors }) => errors.length > 0);

	useEffect(() => {
		if (!dirty || loading) return;
		const timer = setInterval(() => {
			saveControls.start({
				y: [0, -1.5, 1.5, -1.5, 1.5, 0],
				transition: { duration: 0.25, ease: 'easeOut' },
			});
		}, 5000);
		return () => clearInterval(timer);
	}, [dirty, loading, saveControls]);

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
		<Form form={form} layout="vertical" {...formProps}>
			{children}
			<AnimatePresence>
				{dirty && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 8 }}
						transition={{ duration: 0.18, ease: 'easeOut' }}
						style={{ display: 'flex', justifyContent: 'flex-end' }}
					>
						<Flex gap="small" align="center">
							<AnimatePresence initial={false}>
								{!loading && (
									<motion.div
										key="cancel"
										initial={{
											width: 0,
											opacity: 0,
											scale: 0.8,
										}}
										animate={{
											width: 'auto',
											opacity: 1,
											scale: 1,
										}}
										exit={{
											width: 0,
											opacity: 0,
											scale: 0.8,
										}}
										transition={{
											duration: 0.15,
											ease: 'easeOut',
										}}
										style={{
											overflow: 'hidden',
											display: 'inline-flex',
										}}
									>
										<ProButton
											onClick={onCancel}
											{...cancelButton}
										>
											{cancelButton?.children ?? 'Cancel'}
										</ProButton>
									</motion.div>
								)}
							</AnimatePresence>

							<motion.div
								animate={saveControls}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
								}}
							>
								<ProButton
									iconName="Save"
									type="primary"
									disabled={hasErrors}
									onClick={handleSubmit}
									{...submitButton}
								>
									{submitButton?.children ?? 'Save'}
								</ProButton>
							</motion.div>
						</Flex>
					</motion.div>
				)}
			</AnimatePresence>
		</Form>
	);
};
