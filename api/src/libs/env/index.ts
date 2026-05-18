const ENV_KEYS = ['DATABASE_URL', 'JWT_SECRET'] as const;

type EnvKey = (typeof ENV_KEYS)[number];

function initEnv(): Record<EnvKey, string> {
	const missing = ENV_KEYS.filter((key) => !process.env[key]);
	if (missing.length > 0) {
		throw new Error(
			`\n[ENV] Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n\nPlease add them to your .env file\n`,
		);
	}

	return Object.fromEntries(
		ENV_KEYS.map((key) => [key, process.env[key]!]),
	) as Record<EnvKey, string>;
}

export const ENV = initEnv();
