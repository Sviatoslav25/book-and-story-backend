module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {},
};
