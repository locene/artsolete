import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            simpleImportSort,
            unusedImports,
            stylistic,
        },
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            stylistic.configs.recommended,
        ],
        rules: {
            'simpleImportSort/imports': ['error', { groups: [['^\\u0000', '^node:', '^@?\\w', '^', '^\\.']] }],
            'simpleImportSort/exports': 'error',
            'unusedImports/no-unused-imports': 'warn',
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/indent': ['error', 4],
            '@stylistic/jsx-indent-props': ['error', { ignoreTernaryOperator: true }],
        },
    },
]);
