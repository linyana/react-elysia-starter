import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import path from "path";

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
