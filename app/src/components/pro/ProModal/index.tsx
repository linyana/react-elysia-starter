import { Modal, ModalProps } from 'antd';

type IPropsType = ModalProps;

export const ProModal = ({ children, ...rest }: IPropsType) => (
	<Modal centered destroyOnHidden {...rest}>
		{children}
	</Modal>
);
