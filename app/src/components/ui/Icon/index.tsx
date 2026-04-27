import { icons } from "lucide-react";

export const Icon = ({
	name,
	size = 18,
	style,
}: {
	name: keyof typeof icons;
	size?: number;
	style?: React.CSSProperties;
}) => {
	const IconComponent = icons[name];
	return (
		<IconComponent size={size} style={{ verticalAlign: "middle", ...style }} />
	);
};
