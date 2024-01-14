module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
    'import/extensions': ['.js', '.ts'],
  },
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],

    // TODO: Enable in future.
    // 'no-unused-vars': ['error', { 'varsIgnorePattern': '^_' }],
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': ['off'],

    // Ensure layer seggregation.

    'import/no-restricted-paths': ['error', {
      zones: [
        // DAL cannot import from context.
        {
          target: './src/dal/**/*',
          from: './src/context/**/*',
        },
        {
          target: './src/dal/**/*',
          from: './src/web/**/*',
        },
        // Context cannot import from web.
        {
          target: './src/context/**/*',
          from: './src/web/**/*',
        },
      ],
    }],
  },
};
