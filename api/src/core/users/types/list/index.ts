import { FilterSchema } from "@/types";
import { t } from "elysia";

export const UserListSchema = {
	query: t.Composite([
		FilterSchema.query,
		t.Object({
			name: t.Optional(t.String()),
		}),
	]),
};

export type IUserListRequestType = typeof UserListSchema.query.static;
