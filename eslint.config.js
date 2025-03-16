import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * ESLint Configuration
 * - Ignores `dist/` folder (build output)
 * - Supports JSX & latest ECMAScript features
 * - Enforces best practices for React hooks & refresh
 */
export default [
  {
    ignores: ['dist'], // ✅ Ignore build folder
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest', // ✅ Always use latest ECMAScript version
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules, // ✅ Standard JavaScript rules
      ...reactHooks.configs.recommended.rules, // ✅ Best practices for React hooks
      'no-unused-vars': ['error', { varsIgnorePattern: '^_' }], // ✅ Ignore unused variables prefixed with `_`
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'warn', // ✅ Warns about console.log (helpful for production-ready code)
    },
  },
];
