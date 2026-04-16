// Re-export from the canonical api module
import { treaty } from "@elysiajs/eden";
import type { App } from "@api/main";
import { useGlobal } from "@/hooks/useGlobal";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const API = treaty<App>(baseUrl, {
	headers() {
		const { token } = useGlobal.getState();
		return {
			Authorization: token ? `Bearer ${token}` : "",
		};
	},
}).api;
