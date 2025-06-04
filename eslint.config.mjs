// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import storybook from 'eslint-plugin-storybook';
// Import Next.js config properly for detection
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  // Base configurations
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylistic,
  ...tseslint.configs.stylisticTypeChecked,
  
  // Next.js configuration (for proper detection)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  
  // Global settings for TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  // Settings for JavaScript files (no type checking)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  // React configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      // Remove 'import' plugin since it's already included by Next.js config
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      // Import resolver settings are handled by Next.js config
    },
    rules: {
      // React rules
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in React 19/Next.js
      'react/prop-types': 'off', // We use TypeScript
      'react/jsx-uses-react': 'off', // Not needed in React 19
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/no-unescaped-entities': 'error',

      // Next.js rules are handled by the extends above
      // Additional custom rules can go here

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@/prefer-const': 'error',

      // General JavaScript/TypeScript rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'only-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],

      // Import rules (these will work since Next.js includes the import plugin)
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',

      // Accessibility rules
      ...jsxA11y.configs.recommended.rules,
    },
  },

  // Disable type-checking for files that might not be in tsconfig
  {
    files: ['**/*.config.{js,mjs,ts}', '**/*.stories.{js,jsx,ts,tsx}'],
    ...tseslint.configs.disableTypeChecked,
  },

  // Storybook configuration
  {
    files: ['**/*.stories.{js,jsx,ts,tsx}', '**/*.story.{js,jsx,ts,tsx}'],
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'import/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'react/jsx-props-no-spreading': 'off',
      '@next/next/no-img-element': 'off',
    },
  },

  // Test files
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // Configuration files
  {
    files: ['*.config.{js,mjs,ts}', '*.config.*.{js,mjs,ts}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // Prettier integration (must be last)
  prettier,

  // Global ignores
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'storybook-static/**',
      'public/**',
      '.env*',
      '.husky/**',
      '.storybook/storybook-static/**',
    ],
  }
);