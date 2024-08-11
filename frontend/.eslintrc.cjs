module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'all',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'all',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: true,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'variable',
        format: ['PascalCase', 'camelCase']
      },
      {
        selector: 'variable',
        types: ['function'],
        format: ['PascalCase', 'camelCase']
      },
      {
        selector: 'variable',
        modifiers: ['const', 'global', 'PascalCase'],
        format: ['UPPER_CASE']
      },
      {
        selector: 'classProperty',
        modifiers: ['readonly'],
        format: ['UPPER_CASE', 'camelCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'classProperty',
        modifiers: ['static'],
        format: ['UPPER_CASE', 'camelCase']
      },
      {
        selector: 'objectLiteralProperty',
        format: null,
        leadingUnderscore: 'allow'
      },
      {
        selector: 'parameter',
        modifiers: ['unused'],
        format: null,
        leadingUnderscore: 'allow'
      },
      {
        selector: ['classMethod', 'function', 'parameter'],
        format: ['camelCase', 'PascalCase']
      },
      {
        selector: ['typeAlias', 'class', 'interface'],
        format: ['PascalCase']
      }
    ]
  }
}
