import { defineConfig } from 'vite-plus';

export default defineConfig({
	fmt: {
		useTabs: true,
		tabWidth: 4,
		singleQuote: true,
		semi: true,
		trailingComma: 'all',
		printWidth: 80,
		sortPackageJson: false,
		ignorePatterns: ['node_modules', 'dist', 'build'],
	},
});
