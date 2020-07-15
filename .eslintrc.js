module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.test.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint-config-qiwi',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'sonarjs/no-duplicate-string': 'off'
  },
  root: true,
  env: {
    node: true,
    jest: true,
  }
};
