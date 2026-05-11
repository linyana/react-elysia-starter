import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
			'@common': path.resolve(import.meta.dirname, '../common'),
		},
	},
	server: {
		port: 5173,
		open: false,
	},
});
