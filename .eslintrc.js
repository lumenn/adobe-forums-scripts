module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  // extends: ['@airbnb-typescript'],
  extends: ['airbnb-typescript/base'],
  rules: {
    'no-undef': 'off',
    'valid-typeof': 'off',
  }
}