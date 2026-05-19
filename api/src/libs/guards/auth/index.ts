import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { ENV } from "@/libs/env";
import { JWT_NAME, TokenClaimsSchema, type IAuthType } from "./types";
import { AppError } from "@/libs/error";

export * from "./types";

export const jwtPlugin = new Elysia({ name: "libs/jwt" }).use(
	jwt({
		name: JWT_NAME,
		secret: ENV.JWT_SECRET,
		exp: "7d",
		schema: TokenClaimsSchema,
	}),
);

const getBearer = (header: string | null | undefined) =>
	header?.startsWith("Bearer ") ? header.slice(7) : undefined;

const toClaims = (payload: Record<string, unknown>): IAuthType => ({
	userId: payload.userId as number,
	tenantId: payload.tenantId as number,
	email: payload.email as string,
	name: payload.name as string,
	tenantName: (payload.tenantName as string | null) ?? null,
	permissions: (payload.permissions as string[]) ?? [],
});

export const authGuard = new Elysia({ name: "libs/guards/auth" })
	.use(jwtPlugin)
	.macro("auth", {
		resolve: async ({ jwt, headers }) => {
			const token = getBearer(headers.authorization);
			if (!token) throw new AppError("Missing token", 401);
			const payload = await jwt.verify(token);
			if (!payload) throw new AppError("Invalid or expired token", 401);
			return { auth: toClaims(payload) };
		},
	});
