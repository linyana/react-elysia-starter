import { icons, LucideProps } from "lucide-react";

export type ILucideIconType = keyof typeof icons;

type Props = {
	name: ILucideIconType;
	size?: number;
	color?: string;
} & LucideProps;

export const LucideIcon = ({
	name,
	size = 18,
	style,
	color,
	...props
}: Props) => {
	const IconComponent = icons[name];

	return (
		<IconComponent
			size={size}
			color={color || "currentColor"}
			style={{ verticalAlign: "middle", ...style }}
			{...props}
		/>
	);
};
