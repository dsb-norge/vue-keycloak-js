module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  ignorePatterns: ['examples/**/*.js'],
  rules: {
    'no-debugger': 'warn',
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'indent': ['error', 2],
    'object-curly-spacing': ['error', 'always']
  }
}
