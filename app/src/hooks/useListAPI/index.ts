import { useEffect, useState } from "react";
import type { IFilterType, IPaginationType } from "@api/types";
import { useAPI, type UseAPIData } from "../useAPI";

type AnyEdenFn = (...args: any[]) => Promise<{ data: any; error: any }>;

type IListShape<T> = { items: T[]; totalCount: number };

type IInferItem<TFn extends AnyEdenFn> =
	UseAPIData<TFn> extends IListShape<infer U> ? U : never;

const DEFAULT_LIMIT = 10;

/**
 * useListAPI — composite hook for paginated list endpoints whose response
 * shape is `{ items, totalCount }`. Owns filter state (offset/limit/keyword/
 * sortBy/orderBy), auto-fetches on filter change, and exposes the values a
 * `ProTable` consumes (`dataSource`, `pagination`, `setFilter`).
 *
 * @example
 * const { dataSource, pagination, loading, setFilter, refetch } =
 *   useListAPI(API.users.get);
 */
export const useListAPI = <TFn extends AnyEdenFn>(
	apiFn: TFn,
	initialFilter: Partial<IFilterType> = {},
) => {
	type TItem = IInferItem<TFn>;

	const [filter, setFilter] = useState<IFilterType>({
		offset: 0,
		limit: DEFAULT_LIMIT,
		...initialFilter,
	});

	const { data, loading, fetch } = useAPI(apiFn, {
		showLoading: false,
	});

	const refetch = () => fetch({ query: filter } as Parameters<TFn>[0]);

	useEffect(() => {
		refetch();
	}, [filter]);

	const list = data as IListShape<TItem> | null;
	const offset = filter.offset ?? 0;
	const limit = filter.limit ?? DEFAULT_LIMIT;

	const pagination: IPaginationType = {
		current: Math.floor(offset / limit) + 1,
		offset,
		limit,
		totalCount: list?.totalCount ?? 0,
	};

	return {
		filter,
		setFilter,
		data: list?.items ?? [],
		pagination,
		loading,
		fetch: refetch,
	};
};
