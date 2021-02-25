module.exports = {
  extends: [
    'eslint-config-qiwi',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'unicorn/no-null': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'unicorn/prefer-spread': 'off'
  },
  root: true,
  env: {
    node: true,
    jest: true,
  }
};
