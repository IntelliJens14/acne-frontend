import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * ESLint Configuration for a Frontend React App
 * - Ignores `dist/`, `node_modules/`, and `.next/` (for Next.js)
 * - Supports JSX & latest ECMAScript features
 * - Enforces best practices for React, Hooks, and Refresh
 */
export default [
  {
    ignores: ['dist', 'node_modules', '.next'], // ✅ Ignore build & dependency folders
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest', // ✅ Always use latest ECMAScript version
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, process: 'readonly' },
    },
    plugins: {
      react, // ✅ Adds React-specific linting rules
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules, // ✅ Standard JavaScript rules
      ...react.configs.recommended.rules, // ✅ Best practices for React
      ...reactHooks.configs.recommended.rules, // ✅ Best practices for React hooks

      'react/react-in-jsx-scope': 'off', // ✅ Not needed in Next.js or modern React
      'react/prop-types': 'off', // ✅ Disable prop-types if using TypeScript
      'react-hooks/exhaustive-deps': 'warn', // ✅ Warns if dependencies are missing in `useEffect`

      'no-unused-vars': ['error', { varsIgnorePattern: '^_' }], // ✅ Ignore unused variables prefixed with `_`
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // ✅ Warn console logs in production
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // ✅ Disallow debugger in production
    },
    settings: {
      react: {
        version: 'detect', // ✅ Automatically detects the React version
      },
    },
  },
];
