import { ProCard } from "@/components";
import { Button } from "antd";

export const Placeholder = ({ title }: { title: string }) => (
	<ProCard
		title="Product List"
		description="xxx"
		iconName="File"
		extra={<Button type="primary">Pull</Button>}
	>
		{title} content
	</ProCard>
);
