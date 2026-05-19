import { Button, Space, Typography } from 'antd';
import { useNavigate, useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/providers';
import { useGlobal } from '@/hooks';
import { errorIllustrations } from './illustrations';

type ErrorStatus = keyof typeof errorIllustrations;

interface ErrorConfig {
	title: string;
	subTitle: string;
	actions: 'login' | 'home' | 'retry';
}

const ERROR_CONFIG: Record<ErrorStatus, ErrorConfig> = {
	401: {
		title: 'Please Sign In',
		subTitle: 'You need to be logged in to view this page.',
		actions: 'login',
	},
	403: {
		title: 'No Access',
		subTitle: "You don't have permission for this page.",
		actions: 'home',
	},
	404: {
		title: 'Page Not Found',
		subTitle: "	This page doesn't exist or has been moved.",
		actions: 'home',
	},
	500: {
		title: 'Server Error',
		subTitle: 'Something went wrong. Try refreshing or come back later.',
		actions: 'retry',
	},
	502: {
		title: 'Under Maintenance',
		subTitle: "We're upgrading. This usually takes a few minutes.",
		actions: 'retry',
	},
};

const resolveStatus = (status: number): ErrorStatus => {
	if (status in ERROR_CONFIG) return status as ErrorStatus;
	if (status >= 500) return 500;
	if (status === 403) return 403;
	if (status === 401) return 401;
	return 404;
};

const Actions = ({ type }: { type: ErrorConfig['actions'] }) => {
	const navigate = useNavigate();
	const { actions } = useGlobal();

	const goLogin = () => {
		actions.reset();
		navigate('/', { replace: true });
	};

	const goHome = () => navigate('/dashboard', { replace: true });
	const goBack = () => navigate(-1);
	const retry = () => window.location.reload();

	if (type === 'login') {
		return (
			<Space size="middle">
				<Button type="primary" onClick={goLogin}>
					Sign In
				</Button>
			</Space>
		);
	}

	if (type === 'retry') {
		return (
			<Space size="middle">
				<Button onClick={goHome}>Back to Home</Button>
				<Button type="primary" onClick={retry}>
					Retry
				</Button>
			</Space>
		);
	}

	return (
		<Space size="middle">
			<Button onClick={goBack}>Go Back</Button>
			<Button type="primary" onClick={goHome}>
				Back to Home
			</Button>
		</Space>
	);
};

export const ErrorPage = ({
	status,
	errorMessage,
}: {
	status: number;
	errorMessage?: string;
}) => {
	const resolved = resolveStatus(status);
	const config = ERROR_CONFIG[resolved];
	const illustration = errorIllustrations[resolved];

	return (
		<Layout.Centered>
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: 'easeOut' }}
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 16,
					padding: '40px 24px',
					maxWidth: 480,
					textAlign: 'center',
				}}
			>
				<img src={illustration} alt={config.title} width={580} height={380} />

				<Typography.Title level={3} style={{ margin: '8px 0 0' }}>
					{config.title}
				</Typography.Title>

				<Typography.Text type="secondary" style={{ fontSize: 15 }}>
					{errorMessage || config.subTitle}
				</Typography.Text>

				<div style={{ marginTop: 8 }}>
					<Actions type={config.actions} />
				</div>
			</motion.div>
		</Layout.Centered>
	);
};

export const GlobalError = ErrorPage;

export const RouteError = () => {
	const error = useRouteError() as {
		status?: number;
		data?: string;
		message?: string;
		statusText?: string;
	};

	return (
		<ErrorPage
			status={error.status ?? 500}
			errorMessage={error.data || error.message || error.statusText}
		/>
	);
};
