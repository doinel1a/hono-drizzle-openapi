// @ts-expect-error - No types for this plugin
import drizzle from 'eslint-plugin-drizzle';
import prettier from 'eslint-plugin-prettier/recommended';
import { configs as sonarjs } from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['dist']
  },
  sonarjs.recommended,
  unicorn.configs.recommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    }
  },
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' }
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' }
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } }
      ],
      '@typescript-eslint/no-restricted-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true
        }
      ],
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableBoolean: true,
          allowNullableNumber: true
        }
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off'
    }
  },
  prettier,
  {
    files: ['**/*.ts'],
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      drizzle: drizzle
    },
    rules: {
      'drizzle/enforce-update-with-where': ['error', { drizzleObjectName: 'db' }],
      'drizzle/enforce-delete-with-where': ['error', { drizzleObjectName: 'db' }]
    }
  },
  {
    rules: {
      curly: ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // Covered by @typescript-eslint

      'unicorn/prevent-abbreviations': [
        'error',
        {
          ignore: [/env/i, /db/i, /doc/i, /param/i]
        }
      ],

      'sonarjs/deprecation': 'off', // Covered by @typescript-eslint
      'sonarjs/no-array-delete': 'off', // Covered by @typescript-eslint
      'sonarjs/no-unused-vars': 'off', // Covered by @typescript-eslint
      'sonarjs/prefer-regexp-exec': 'off', // Covered by @typescript-eslint
      'sonarjs/unused-import': 'off', // Covered by @typescript-eslint

      'unicorn/no-array-sort': 'off',
      'unicorn/no-nested-ternary': 'off', // Covered by sonarjs/no-nested-conditional
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-includes': 'off', // Covered by @typescript-eslint
      'unicorn/prefer-string-starts-ends-with': 'off' // Covered by @typescript-eslint
    }
  }
]);
