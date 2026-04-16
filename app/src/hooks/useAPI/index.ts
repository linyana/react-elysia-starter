import { useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import { useMessage } from '@/hooks/useMessage';

// ─── Type helpers ────────────────────────────────────────────────────────────

type AnyEdenFn = (...args: any[]) => Promise<{ data: any; error: any }>;

/** Infer the response payload type from an Eden Treaty function */
type InferData<TFn extends AnyEdenFn> = NonNullable<
  Awaited<ReturnType<TFn>>['data']
>;

/** The parameter type the Eden function accepts (e.g. { body: ... } for POST) */
type InferOptions<TFn extends AnyEdenFn> = Parameters<TFn>[0];

/** Utility: extract the unwrapped payload type from an Eden Treaty function */
export type UseAPIData<TFn extends AnyEdenFn> = InferData<TFn>;

// ─── Public types ─────────────────────────────────────────────────────────────

type MessageOption = 'default' | null | (string & {});

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
    action?: (errorMessage: string) => void;
  };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useApi — wraps any Eden Treaty call with React loading/data/error state.
 *
 * Types are inferred entirely from the Eden function; no manual type definitions needed.
 *
 * @example
 * const { data: projects, fetchData } = useAPI(API.projects.get);
 * useEffect(() => { fetchData(); }, []);
 *
 * @example — with body
 * const { fetchData: create } = useAPI(API.projects.post, {
 *   success: { message: 'default', action: () => refresh() },
 * });
 * create({ body: { name: 'foo', path: '/foo' } });
 */
export function useAPI<TFn extends AnyEdenFn>(
  apiFn: TFn,
  options?: UseAPIOptions<InferData<TFn>>,
) {
  type TData = InferData<TFn>;
  type TCallOptions = InferOptions<TFn>;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const message = useMessage();
  const latestId = useRef(0);

  const fetchData = async (callOptions?: TCallOptions) => {
    latestId.current += 1;
    const requestId = latestId.current;

    const showLoading = options?.showLoading ?? true;
    const loadingKey = nanoid();

    if (showLoading) {
      message.loading({ content: 'Loading...', key: loadingKey });
    }

    setLoading(true);
    setErrorMessage(null);

    const { data: responseBody, error } = await apiFn(callOptions);

    if (requestId !== latestId.current) return;

    setLoading(false);

    if (error) {
      const msg: string =
        error?.value?.message ?? 'An unknown error occurred';

      setErrorMessage(msg);

      const errMsg = options?.error?.message ?? 'default';
      if (errMsg !== null) {
        message.error({ key: loadingKey, content: errMsg === 'default' ? msg : errMsg });
      } else if (showLoading) {
        message.dismiss(loadingKey);
      }

      options?.error?.action?.(msg);
    } else {
      setData(responseBody);

      const successMsg = options?.success?.message;
      if (successMsg !== undefined && successMsg !== null) {
        const content = successMsg === 'default' ? 'Successfully' : successMsg;
        message.success({ key: loadingKey, content });
      } else if (showLoading) {
        message.dismiss(loadingKey);
      }

      options?.success?.action?.(responseBody);
    }
  };

  return { data, loading, errorMessage, fetchData };
}
