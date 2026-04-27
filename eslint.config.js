import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['app/src/**/*.{ts,tsx}'],
    ignores: ['app/src/components/**'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
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
];
