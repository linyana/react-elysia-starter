import { Modal, Input, List, Empty, theme } from "antd";
import { CornerDownLeft, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { icons } from "lucide-react";
import type { IRouteType } from "@/types";
import { LucideIcon } from "@/components";

type ICommand = {
	key: string;
	label: React.ReactNode;
	path: string;
	iconName?: keyof typeof icons;
	featured?: boolean;
};

const joinPath = (base: string, sub: string) =>
	`${base.replace(/\/$/, "")}/${sub.replace(/^\//, "")}`.replace(/\/+/g, "/");

const flattenRoutes = (routes: IRouteType[], parent = ""): ICommand[] =>
	routes.flatMap((r) => {
		const sub = r.path ?? "";
		const full = sub ? joinPath(parent, sub) : parent;

		const self =
			r.handle?.menu?.label &&
			r.path &&
			!r.path.includes("*") &&
			!r.path.includes("http")
				? [
						{
							key: full,
							label: r.handle.menu.label,
							path: full,
							iconName: r.handle.menu.iconName,
							featured: r.handle.menu.featured,
						},
					]
				: [];

		return [...self, ...(r.children ? flattenRoutes(r.children, full) : [])];
	});

type IPropsType = {
	open: boolean;
	onClose: () => void;
	routes: IRouteType[];
};

export const CommandPalette = ({ open, onClose, routes }: IPropsType) => {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [active, setActive] = useState(0);
	const {
		token: {
			controlItemBgHover,
			borderRadius,
			colorTextTertiary,
			colorBorderSecondary,
		},
	} = theme.useToken();

	const all = useMemo(() => flattenRoutes(routes), [routes]);
	const featured = useMemo(() => all.filter((c) => c.featured), [all]);
	const isEmptyQuery = !query.trim();
	const items = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return featured.length ? featured : all;
		return all.filter((c) => String(c.label).toLowerCase().includes(q));
	}, [all, featured, query]);

	useEffect(() => {
		setActive(0);
	}, [query, open]);

	const select = (cmd?: ICommand) => {
		const target = cmd ?? items[active];
		if (!target) return;
		navigate(target.path);
		setQuery("");
		onClose();
	};

	const onKeyDown: React.KeyboardEventHandler = (e) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((i) => Math.min(i + 1, items.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			select();
		}
	};

	return (
		<Modal
			open={open}
			onCancel={() => {
				setQuery("");
				onClose();
			}}
			footer={null}
			closable={false}
			destroyOnHidden
			styles={{ body: { padding: 0 } }}
		>
			<Input
				autoFocus
				size="large"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={onKeyDown}
				prefix={<Search size={16} style={{ opacity: 0.6, marginRight: 4 }} />}
				placeholder="Jump to page…"
				variant="borderless"
				style={{ padding: "14px 16px" }}
			/>
			<div
				style={{
					maxHeight: 360,
					overflow: "auto",
					borderTop: `1px solid ${colorBorderSecondary}`,
				}}
			>
				{items.length === 0 ? (
					<Empty
						description="No matches"
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						style={{ padding: 24 }}
					/>
				) : (
					<>
						{isEmptyQuery && featured.length > 0 && (
							<div
								style={{
									padding: "10px 16px 4px",
									fontSize: 11,
									fontWeight: 600,
									letterSpacing: 0.4,
									textTransform: "uppercase",
									color: colorTextTertiary,
								}}
							>
								Suggested
							</div>
						)}
						<List
							size="small"
							dataSource={items}
							split={false}
							style={{ padding: 6 }}
							renderItem={(item, i) => (
								<List.Item
									onClick={() => select(item)}
									onMouseEnter={() => setActive(i)}
									style={{
										cursor: "pointer",
										padding: "8px 12px",
										borderRadius,
										background: i === active ? controlItemBgHover : undefined,
										border: "none",
										gap: 12,
									}}
								>
									{item.iconName ? (
										<LucideIcon
											name={item.iconName}
											size={16}
											style={{ color: colorTextTertiary, flexShrink: 0 }}
										/>
									) : (
										<span style={{ width: 16, flexShrink: 0 }} />
									)}
									<span style={{ flex: 1 }}>{item.label}</span>
									<span
										style={{
											color: colorTextTertiary,
											fontSize: 12,
											fontFamily: "ui-monospace, monospace",
										}}
									>
										{item.path}
									</span>
									{i === active && (
										<CornerDownLeft
											size={14}
											style={{ color: colorTextTertiary, flexShrink: 0 }}
										/>
									)}
								</List.Item>
							)}
						/>
					</>
				)}
			</div>
		</Modal>
	);
};
