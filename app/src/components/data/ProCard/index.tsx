import { ILucideIconType, LucideIcon } from "../../primitives/LucideIcon";
import { Card, Flex, Typography } from "antd";
import type { CardProps } from "antd";

const { Title, Text } = Typography;

type IPropsType = Omit<CardProps, "title" | "extra"> & {
	title?: React.ReactNode;
	description?: React.ReactNode;
	extra?: React.ReactNode;
	iconName?: ILucideIconType;
};

/**
 * Enhanced antd Card. Renders its header with the project's standard
 * title-bar style (icon + title + description + extra). All other Card
 * props (`bordered`, `hoverable`, `loading`, `styles`, `actions`, …) pass
 * through unchanged.
 */
export const ProCard = ({
	title,
	description,
	extra,
	iconName,
	children,
	styles,
	...rest
}: IPropsType) => {
	const hasHeader = title || description || iconName || extra;

	return (
		<Card
			{...rest}
			title={
				hasHeader ? (
					<Flex
						align="center"
						justify="space-between"
						style={{ margin: "12px 0" }}
						wrap="wrap"
					>
						<Flex align="center" gap="middle">
							{iconName && (
								<Flex justify="center" align="center">
                  <LucideIcon size={24} name={iconName} />
								</Flex>
							)}
							<Flex vertical>
								<Title level={5} style={{ margin: 0 }}>
									{title}
								</Title>
								{description && (
									<Text
										type="secondary"
										style={{
											whiteSpace: "normal",
											fontWeight: 400,
											fontSize: 13,
										}}
									>
										{description}
									</Text>
								)}
							</Flex>
						</Flex>
						<div>{extra}</div>
					</Flex>
				) : undefined
			}
		>
			{children}
		</Card>
	);
};
