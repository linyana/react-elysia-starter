import { LucideIcon } from '@/components';
import { Button, ButtonProps } from 'antd';

export type ProButtonAction = 'DELETE' | 'EDIT' | 'VIEW';

const ACTION_CONFIG: Record<ProButtonAction, ButtonProps> = {
	DELETE: { icon: <LucideIcon name="Trash2" />, danger: true },
	EDIT: { icon: <LucideIcon name="SquarePen" /> },
	VIEW: { icon: <LucideIcon name="Eye" /> },
};

type IProButtonProps = ButtonProps & {
	action?: ProButtonAction;
};

export const ProButton = ({
	action,
	...rest
}: IProButtonProps) => {
	const config = action ? ACTION_CONFIG[action] : undefined;

	return (
		<Button
      type="text"
      {...config}
			{...rest}
		/>
	);
};
