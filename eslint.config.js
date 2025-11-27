// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const eslint = require('@eslint/js');
const tsEslint = require('typescript-eslint');
const unicornPlugin = require('eslint-plugin-unicorn');
const headerPlugin = require('eslint-plugin-header');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

// https://github.com/Stuk/eslint-plugin-header/issues/57
headerPlugin.rules.header.meta.schema = false;

module.exports = [
  {
    ignores: ['node_modules/**', 'lib/**', '**/dist/**', 'src/converter/test/outputs/**', 'test/mock-test-utils/**'],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      unicorn: unicornPlugin,
      header: headerPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      curly: 'error',
      eqeqeq: 'error',
      'no-return-await': 'error',
      'require-await': 'error',
      'header/header': [
        'error',
        'line',
        [' Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.', ' SPDX-License-Identifier: Apache-2.0'],
      ],
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'no-dupe-class-members': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.test.ts', '**/test/**/*.ts', 'src/converter/**/*.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'header/header': 'off',
      'prettier/prettier': 'off',
    },
  },
  {
    files: ['packages/converter/test/inputs/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
];
