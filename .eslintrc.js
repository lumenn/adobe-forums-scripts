module.exports = {
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
  },
  overrides: [
    {
      files: ['*.ts'], 
      extends: ['airbnb-typescript/base'],
    }
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'no-undef': 'off',
    'valid-typeof': 'off',
    'import/extensions': [
      'error',
      'ignorePackages', 
      {
        'ts': 'never'
      },
    ]
  }
}