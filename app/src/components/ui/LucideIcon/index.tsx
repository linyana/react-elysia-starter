import { icons } from "lucide-react";

export type ILucideIconType = keyof typeof icons

export const LucideIcon = ({
	name,
	size = 18,
	style,
}: {
	name: ILucideIconType;
	size?: number;
	style?: React.CSSProperties;
}) => {
	const IconComponent = icons[name];
	return (
		<IconComponent size={size} color="#4e4e4e" style={{ verticalAlign: "middle", ...style }} />
	);
};
