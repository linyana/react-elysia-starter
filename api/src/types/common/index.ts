import { t } from "elysia";

export type IPaginationType = {
	current: number;
	limit: number;
	offset: number;
	totalCount: number;
};

export const FilterSchema = {
	query: t.Object({
		offset: t.Numeric({ default: 0 }),
		limit: t.Numeric({ default: 10 }),
		keyword: t.Optional(t.String()),
		sortBy: t.String({ default: "createdAt" }),
		orderBy: t.UnionEnum(["asc", "desc"], { default: "desc" }),
	}),
};

export type IFilterType = typeof FilterSchema.query.static;
