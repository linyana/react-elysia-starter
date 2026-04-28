import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import { useMessage } from "@/hooks/useMessage";

// ─── Type helpers ────────────────────────────────────────────────────────────

type AnyEdenFn = (...args: any[]) => Promise<{ data: any; error: any }>;

/** Infer the response payload type from an Eden Treaty function */
type InferData<TFn extends AnyEdenFn> = NonNullable<
	Awaited<ReturnType<TFn>>["data"]
>;

/** The parameter type the Eden function accepts (e.g. { body: ... } for POST) */
type InferOptions<TFn extends AnyEdenFn> = Parameters<TFn>[0];

/** Utility: extract the unwrapped payload type from an Eden Treaty function */
export type UseAPIData<TFn extends AnyEdenFn> = InferData<TFn>;

// ─── Public types ─────────────────────────────────────────────────────────────

type MessageOption = "default" | null | (string & {});

export type UseAPIOptions<TData> = {
	/** Show a loading toast while the request is in flight (default: true) */
	showLoading?: boolean;
	success?: {
		/** 'default' → use meta.message from response; null → silent; string → custom text */
		message?: MessageOption;
		action?: (data: TData) => void;
	};
	error?: {
		/** 'default' → use server error message; null → silent; string → custom text */
		message?: MessageOption;
		action?: (errorMessage: string, status?: number) => void;
	};
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

type UseAPIProps<TFn extends AnyEdenFn> = { fetcher: TFn } & UseAPIOptions<
	InferData<TFn>
>;

export function useAPI<TFn extends AnyEdenFn>({
	fetcher,
	...options
}: UseAPIProps<TFn>) {
	type TData = InferData<TFn>;
	type TCallOptions = InferOptions<TFn>;

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<TData | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const message = useMessage();
	const latestId = useRef(0);

	/**
	 * Execute the wrapped call.
	 *
	 * Returns the response payload on success, or `null` on error / stale
	 * response (so composition can short-circuit with a simple falsy check).
	 * Toasts, error messages, and race-condition handling are already
	 * applied — callers only orchestrate.
	 */
	const fetch = async (callOptions?: TCallOptions): Promise<TData | null> => {
		latestId.current += 1;
		const requestId = latestId.current;

		const showLoading = options?.showLoading ?? true;
		const loadingKey = nanoid();

		if (showLoading) {
			message.loading({ content: "Loading...", key: loadingKey });
		}

		setLoading(true);
		setErrorMessage(null);

		const { data: responseBody, error } = await fetcher(callOptions);

		// Stale response (superseded by a newer call) — swallow silently.
		if (requestId !== latestId.current) return null;

		setLoading(false);

		if (error) {
			const msg: string = error?.value?.message ?? "An unknown error occurred";

			setErrorMessage(msg);

			const errMsg = options?.error?.message ?? "default";
			if (errMsg !== null) {
				message.error({
					key: loadingKey,
					content: errMsg === "default" ? msg : errMsg,
				});
			} else if (showLoading) {
				message.dismiss(loadingKey);
			}

			options?.error?.action?.(msg, error?.status);
			return null;
		}

		setData(responseBody);

		const successMsg = options?.success?.message;
		if (successMsg !== undefined && successMsg !== null) {
			const content = successMsg === "default" ? "Successfully" : successMsg;
			message.success({ key: loadingKey, content });
		} else if (showLoading) {
			message.dismiss(loadingKey);
		}

		options?.success?.action?.(responseBody);
		return responseBody as TData;
	};

	return { data, loading, errorMessage, fetch };
}
