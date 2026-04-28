import { useEffect, useState } from "react";
import type { IFilterType, IPaginationType } from "@api/types";
import { useAPI, type UseAPIData, type UseAPIOptions } from "../useAPI";

type AnyEdenFn = (...args: any[]) => Promise<{ data: any; error: any }>;

type IListShape<T> = { items: T[]; totalCount: number };

type IInferItem<TFn extends AnyEdenFn> =
	UseAPIData<TFn> extends IListShape<infer U> ? U : never;

const DEFAULT_LIMIT = 10;

type UseListAPIProps<TFn extends AnyEdenFn> = {
	fetcher: TFn;
	initialFilter?: Partial<IFilterType>;
} & UseAPIOptions<UseAPIData<TFn>>;

export const useListAPI = <TFn extends AnyEdenFn>({
	fetcher,
	initialFilter = {},
	...props
}: UseListAPIProps<TFn>) => {
	type TItem = IInferItem<TFn>;

	const [filter, setFilter] = useState<IFilterType>({
		offset: 0,
		limit: DEFAULT_LIMIT,
		...initialFilter,
	});

	const { data, loading, fetch } = useAPI({
		fetcher,
		showLoading: props?.showLoading ?? false,
		...props,
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
