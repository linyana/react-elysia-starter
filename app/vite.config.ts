import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async () => ({
	plugins: [react()],
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
