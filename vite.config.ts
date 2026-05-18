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
	lint: {
		ignorePatterns: [
			'**/node_modules/**',
			'**/dist/**',
			'**/build/**',
			'app/src/components/**',
		],
		overrides: [
			{
				files: ['api/src/**/*.ts', 'api/src/**/*.tsx'],
				rules: {
					'no-restricted-properties': [
						'error',
						{
							object: 'process',
							property: 'env',
							message:
								'Direct process.env access is forbidden. Use ENV from @/libs/env instead.',
						},
					],
				},
			},
			{
				files: ['app/src/**/*.ts', 'app/src/**/*.tsx'],
				rules: {
					'no-restricted-imports': [
						'error',
						{
							patterns: [
								{
									group: ['@/components/*'],
									message:
										'Components must be imported from the barrel: `@/components`. Deep imports are forbidden.',
								},
								{
									regex:
										'^(\\.\\./)+(hooks|components|providers|libs|types|pages|config)(/.*)?$',
									message:
										'Use the `@/` alias for top-level modules (e.g. `@/hooks`) instead of relative parent-traversal paths.',
								},
							],
						},
					],
				},
			},
		],
	},
});
