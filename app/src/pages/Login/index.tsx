import {
	Avatar,
	Button,
	Col,
	Flex,
	Form,
	Input,
	Row,
	Space,
	Tag,
	Typography,
} from "antd";
import { Icon } from "@/components";
import { useAPI, useGlobal } from "@/hooks";
import heroSvg from "@/assets/login-hero.svg";
import logoSvg from "@/assets/logo.svg";
import { API } from "@/libs";

const { Title, Text, Paragraph, Link } = Typography;

type IFormValues = {
	email: string;
	password: string;
};

export const Login = () => {
	const { actions } = useGlobal();

	const { fetch, loading } = useAPI(API.auth.login.post, {
		success: {
			message: "Welcome back.",
			action: ({ token }) => {
				actions.set({ token });
			},
		},
	});

	const handleSubmit = (values: IFormValues) => {
		fetch(values);
	};

	return (
		<Row style={{ minHeight: "100vh" }}>
			<Col
				xs={0}
				md={12}
				lg={13}
				style={{
					position: "relative",
					overflow: "hidden",
					background:
						"radial-gradient(1200px 600px at 15% -10%, #1f1f23 0%, #0b0b0d 55%, #060607 100%)",
					color: "#fafafa",
				}}
			>
				<img
					src={heroSvg}
					alt=""
					aria-hidden
					style={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover",
						opacity: 0.9,
					}}
				/>
				<Flex
					vertical
					justify="space-between"
					style={{ position: "relative", height: "100%", padding: "48px 56px" }}
				>
					<Space align="center" size={10}>
						<Avatar src={logoSvg} shape="square" size={32} />
						<Text
							strong
							style={{ color: "#fff", letterSpacing: "0.18em", fontSize: 13 }}
						>
							PROJECT NAME
						</Text>
					</Space>

					<Flex vertical gap={20} style={{ maxWidth: 520 }}>
						<Tag
							style={{
								background: "rgba(255,255,255,0.06)",
								color: "rgba(255,255,255,0.75)",
								borderRadius: 999,
								padding: "4px 12px",
								fontSize: 12,
								letterSpacing: "0.06em",
								width: "fit-content",
							}}
						>
							<Space size={8}>
								<span
									style={{
										display: "inline-block",
										width: 6,
										height: 6,
										borderRadius: "50%",
										background: "#8ef0c5",
										boxShadow: "0 0 8px #8ef0c5",
									}}
								/>
								Control plane · v2.4
							</Space>
						</Tag>

						<Title
							level={1}
							style={{
								color: "#fafafa",
								margin: 0,
								fontSize: 46,
								fontWeight: 600,
								lineHeight: 1.1,
								letterSpacing: "-0.02em",
							}}
						>
							Build with clarity.
							<br />
							Ship with confidence.
						</Title>

						<Paragraph
							style={{
								color: "rgba(240,240,240,0.65)",
								fontSize: 15,
								lineHeight: 1.65,
								margin: 0,
								maxWidth: 460,
							}}
						>
							A calm workspace for teams who care about craft — unified
							observability, intentional defaults, and friction-free deploys.
						</Paragraph>
					</Flex>
				</Flex>
			</Col>

			<Col xs={24} md={12} lg={11}>
				<Flex
					align="center"
					justify="center"
					style={{ minHeight: "100vh", padding: 24 }}
				>
					<Flex vertical style={{ width: "100%", maxWidth: 400 }}>
						<Space vertical size={4} style={{ marginBottom: 28 }}>
							<Title level={2} style={{ margin: 0, fontWeight: 600 }}>
								Sign in to your workspace
							</Title>
							<Text type="secondary">
								Enter your credentials to access the dashboard.
							</Text>
						</Space>

						<Form<IFormValues>
							layout="vertical"
							requiredMark={false}
							onFinish={handleSubmit}
							size="large"
						>
							<Form.Item
								name="email"
								label="Email"
								rules={[
									{ required: true, message: "Email is required" },
									{ type: "email", message: "Enter a valid email" },
								]}
							>
								<Input
									prefix={<Icon name="Mail" size={16} />}
									placeholder="you@company.com"
									autoComplete="email"
								/>
							</Form.Item>

							<Form.Item
								name="password"
								label={
									<Flex justify="space-between" align="center" gap="small">
										<span>Password</span>
										<div>
											<Link href="#" style={{ fontSize: 12 }}>
												Forgot password?
											</Link>
										</div>
									</Flex>
								}
								rules={[{ required: true, message: "Password is required" }]}
							>
								<Input.Password
									prefix={<Icon name="Lock" size={16} />}
									placeholder="Enter your password"
									autoComplete="current-password"
								/>
							</Form.Item>

							<Form.Item style={{ marginBottom: 0 }}>
								<Button
									type="primary"
									htmlType="submit"
									block
									loading={loading}
								>
									Sign in
								</Button>
							</Form.Item>
						</Form>

						<Paragraph
							type="secondary"
							style={{
								fontSize: 12,
								textAlign: "center",
								marginTop: 24,
								marginBottom: 0,
							}}
						>
							By continuing you agree to our <Link href="#">Terms</Link> and{" "}
							<Link href="#">Privacy Policy</Link>.
						</Paragraph>
					</Flex>
				</Flex>
			</Col>
		</Row>
	);
};
