import { useEffect, useState } from "react";
import { useGlobal } from "@/hooks";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Tag, Tooltip } from "antd";
import { CircleHelp, Search } from "lucide-react";
import type { IRouteType } from "@/types";
import { CommandPalette } from "./CommandPalette";
import { Icon } from "@/components";

type IPropsType = {
	routes: IRouteType[];
};

export const Header = ({ routes }: IPropsType) => {
	const { collapsed, actions } = useGlobal();
	const [paletteOpen, setPaletteOpen] = useState(false);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setPaletteOpen(true);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	return (
		<>
			<Flex
				justify="space-between"
				align="center"
				gap={12}
				style={{ width: "100%" }}
			>
				<Flex align="center" gap={8}>
					<Button
						type="text"
						icon={
							collapsed ? (
								<Icon name="ListCollapse" />
							) : (
								<Icon
									name="ListCollapse"
									style={{ transform: "rotate(180deg)" }}
								/>
							)
						}
						onClick={() => actions.set({ collapsed: !collapsed })}
						size="large"
					/>
					<div
						onClick={() => setPaletteOpen(true)}
						style={{ width: 320, cursor: "pointer" }}
					>
						<Input
							readOnly
							placeholder="Search…"
							prefix={<Search size={14} style={{ opacity: 0.6 }} />}
							suffix={<Tag style={{ margin: 0, opacity: 0.7 }}>⌘K</Tag>}
							style={{
								borderRadius: 8,
								cursor: "pointer",
								pointerEvents: "none",
							}}
						/>
					</div>
				</Flex>

				<Flex align="center" gap={4}>
					<Tooltip title="Help center">
						<Button
							type="text"
							shape="circle"
							icon={<CircleHelp size={18} />}
						/>
					</Tooltip>
				</Flex>
			</Flex>

			<CommandPalette
				open={paletteOpen}
				onClose={() => setPaletteOpen(false)}
				routes={routes}
			/>
		</>
	);
};
