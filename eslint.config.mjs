import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Domain code stays independent of UI and platform (ADR-003, ADR-008).
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['react', 'react/*', 'react-dom', 'react-dom/*'], message: 'src/domain must not depend on React.' },
            { group: ['react-native', 'react-native/*', '@react-native/*', '@react-native-*/*'], message: 'src/domain must not depend on React Native.' },
            { group: ['expo', 'expo-*', 'expo/*', '@expo/*'], message: 'src/domain must not depend on Expo.' },
            { group: ['**/components', '**/components/*', '**/components/**'], message: 'src/domain must not import UI components.' },
            { group: ['**/context', '**/context/*', '**/services/*', '**/services/**', '**/theme', '**/theme/*'], message: 'src/domain must not import app state, storage or theme.' },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'web-build/',
      'coverage/',
    ],
  }
);
