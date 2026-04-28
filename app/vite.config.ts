import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import path from "path";

// vite-plugin-checker swallows TS's "File change detected..." (codes 6031/6032),
// so the only way to surface a "rechecking" hint is to watch the FS ourselves.
const tsRecheckIndicator = (): PluginOption => {
	let lastPrint = 0;
	return {
		name: "ts-recheck-indicator",
		apply: "serve",
		configureServer(server) {
			server.watcher.on("change", (file) => {
				if (!/\.(ts|tsx)$/.test(file)) return;
				const now = Date.now();
				if (now - lastPrint < 200) return; // throttle bursty saves
				lastPrint = now;
				// eslint-disable-next-line no-console
				console.log("[Typescript] \x1b[33m↻\x1b[0m APP rechecking…");
			});
		},
	};
};

export default defineConfig(async () => ({
	plugins: [
		react(),
		checker({
			typescript: {
				tsconfigPath: path.resolve(__dirname, "./tsconfig.json"),
			},
			overlay: { initialIsOpen: false },
			terminal: true,
			// Build is gated by `tsgo` in package.json scripts (faster than tsc),
			// so we don't double-check during vite build.
			enableBuild: false,
		}),
		tsRecheckIndicator(),
	],
	clearScreen: false,
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@common": path.resolve(__dirname, "../common"),
		},
	},
	server: {
    port: 5173,
    open: false,
	},
}));
