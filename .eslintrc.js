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
  rules: {
    'prettier/prettier': 0,
    'no-use-before-define': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 1,
    'class-methods-use-this': 0,
  },
};
