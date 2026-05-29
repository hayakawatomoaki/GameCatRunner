import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist'],
  },
  {
    files: ['public/service-worker.js'],
    languageOptions: {
      globals: {
        caches: 'readonly',
        fetch: 'readonly',
        self: 'readonly',
      },
    },
  },
);
