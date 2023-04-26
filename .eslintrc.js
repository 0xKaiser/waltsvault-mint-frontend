module.exports = {
  env: {
    jest: true,
  },
  root: true,
  extends: ['airbnb', 'airbnb-typescript', 'prettier', 'plugin:react-hooks/recommended'],
  plugins: ['@typescript-eslint', 'react', 'prettier', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: ['./tsconfig.json', './packages/*/tsconfig.json', './apps/*/tsconfig.json'],
  },
  ignorePatterns: ['apps/*/build/*', 'apps/*/scripts/*', 'apps/*/config/*'],
  rules: {
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        // additionalHooks: '(customHook1|customHook2)',
      },
    ],
    'import/prefer-default-export': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/jsx-no-bind': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': ['error'],
    'import/extensions': 'off',
    'react/require-default-props': 'off',
    'import/no-unresolved': 0,
    'import/no-cycle': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unused-prop-types': 'off',
    'react/prop-types': 'off',
    'no-console': ['warn', { allow: ['error'] }],
    'no-param-reassign': 'off',
    '@typescript-eslint/indent': 'off',
    'no-restricted-exports': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'unused-imports/no-unused-imports-ts': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: ['builtin', 'external', 'index', 'sibling', 'parent', 'internal'],
        'newlines-between': 'always',
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};
