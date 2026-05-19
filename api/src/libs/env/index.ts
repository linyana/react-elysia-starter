import { AppError } from "@/utils";

const REQUIRED_KEYS = ["DATABASE_URL", "JWT_SECRET"] as const;

const OPTIONAL_KEYS = {
	PORT: "3000",
} as const satisfies Record<string, string>;

type RequiredKey = (typeof REQUIRED_KEYS)[number];
type OptionalKey = keyof typeof OPTIONAL_KEYS;

function initEnv(): Record<RequiredKey | OptionalKey, string> {
	const missing = REQUIRED_KEYS.filter((key) => !Bun.env[key]);
	if (missing.length > 0) {
		throw new AppError(
			`\n[ENV] Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}\n\nPlease add them to your .env file\n`,
		);
	}

	const required = Object.fromEntries(
		REQUIRED_KEYS.map((key) => [key, Bun.env[key]!]),
	);

	const optional = Object.fromEntries(
		Object.entries(OPTIONAL_KEYS).map(([key, fallback]) => [
			key,
			Bun.env[key] || fallback,
		]),
	);

	return { ...required, ...optional } as Record<
		RequiredKey | OptionalKey,
		string
	>;
}

export const ENV = initEnv();
