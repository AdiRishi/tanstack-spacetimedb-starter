//  @ts-check
import { tanstackConfig } from '@tanstack/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  ...tanstackConfig,
  {
    ignores: [
      '.output',
      '.wrangler',
      '.tanstack',
      'public',
      '**/*.gen.ts',
      'src/module_bindings/*',
      'eslint.config.js',
      'prettier.config.js',
    ],
  },
  {
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
      '@typescript-eslint/no-unnecessary-condition': 'off',
      // Import ordering handled by Prettier via @trivago/prettier-plugin-sort-imports
      'import/order': 'off',
    },
  },
  // Must be last - disables ESLint rules that conflict with Prettier
  eslintConfigPrettier,
]
