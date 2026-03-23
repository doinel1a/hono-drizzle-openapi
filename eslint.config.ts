import prettierConfig from 'eslint-config-prettier/flat';
// @ts-expect-error - No types for this plugin
import drizzlePlugin from 'eslint-plugin-drizzle';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import { configs as sonarjs } from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['dist']
  },
  prettierConfig,
  prettierPlugin,
  sonarjs.recommended,
  unicorn.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      drizzle: drizzlePlugin
    },
    rules: {
      'drizzle/enforce-delete-with-where': ['error', { drizzleObjectName: 'db' }],
      'drizzle/enforce-update-with-where': ['error', { drizzleObjectName: 'db' }]
    }
  },
  {
    rules: {
      'unicorn/prevent-abbreviations': [
        'error',
        {
          ignore: [/env/i, /db/i, /doc/i, /param/i]
        }
      ]
    }
  }
]);
