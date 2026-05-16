import { LucideIcon } from '@/components';
import type { ILucideIconType } from '@/components';
import { Button, ButtonProps } from 'antd';

export type ProButtonAction = 'DELETE' | 'EDIT' | 'VIEW';

const ACTION_CONFIG: Record<
	ProButtonAction,
	{ iconName: ILucideIconType; danger?: boolean }
> = {
	DELETE: { iconName: 'Trash2', danger: true },
	EDIT: { iconName: 'SquarePen' },
	VIEW: { iconName: 'Eye' },
};

export type ProButtonProps = ButtonProps & {
	action?: ProButtonAction;
	iconName?: ILucideIconType;
};

export const ProButton = ({
	action,
	iconName,
	icon,
	...rest
}: ProButtonProps) => {
	const config = action ? ACTION_CONFIG[action] : undefined;
	const resolvedIconName = iconName ?? config?.iconName;
	const resolvedIcon =
		icon ??
		(resolvedIconName ? <LucideIcon size={16} name={resolvedIconName} /> : undefined);

	return (
		<Button
			danger={config?.danger}
			{...rest}
			icon={resolvedIcon}
		/>
	);
};
