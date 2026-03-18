import prettierConfig from 'eslint-config-prettier/flat';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['dist']
  },
  prettierConfig,
  prettierPlugin,
  sonarjs.configs.recommended,
  unicorn.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            env: true
          }
        }
      ]
    }
  }
]);
