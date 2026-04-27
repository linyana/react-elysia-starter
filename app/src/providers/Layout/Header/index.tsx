import { useEffect, useState } from "react";
import { useMatches } from "react-router-dom";
import { useGlobal } from "@/hooks";
import { Button, Flex, Input, Tag, Tooltip, Typography } from "antd";
import { Search } from "lucide-react";
import type { IRouteType } from "@/types";
import { CommandPalette } from "./CommandPalette";
import { LucideIcon } from "@/components";

type IPropsType = {
	routes: IRouteType[];
};

export const Header = ({ routes }: IPropsType) => {
	const { collapsed, actions } = useGlobal();
	const [paletteOpen, setPaletteOpen] = useState(false);
	const matches = useMatches();
	const currentHandle = matches[matches.length - 1]?.handle as IRouteType["handle"];
	const pageTitle = currentHandle?.menu?.label;

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
								<LucideIcon name="ListCollapse" />
							) : (
								<LucideIcon
									name="ListCollapse"
									style={{ transform: "rotate(180deg)" }}
								/>
							)
						}
						onClick={() => actions.set({ collapsed: !collapsed })}
					/>
					{pageTitle && (
						<Typography.Text strong style={{ fontSize: 15 }}>
							{pageTitle}
						</Typography.Text>
					)}
				</Flex>

				<div
					onClick={() => setPaletteOpen(true)}
					style={{
						width: 460,
						cursor: "pointer",
						position: "absolute",
						left: "50%",
						transform: "translateX(-50%)",
					}}
				>
					<Input
						readOnly
						variant="underlined"
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

				<Flex align="center" gap={4}>
					<Tooltip title="Help center">
						<Button
							type="text"
							shape="circle"
							icon={<LucideIcon name="CircleQuestionMark" />}
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
