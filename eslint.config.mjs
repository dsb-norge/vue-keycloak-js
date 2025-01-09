import tseslint from 'typescript-eslint'

export default [
  {
    name: 'Ignore',
    ignores: [
      '**/dist/',
      '**/dev-dist/',
      '**/node_modules/',
      // '**/examples',
    ]
  },
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    name: 'Overrides',
    rules: {
      'no-debugger': 'warn',
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'indent': ['error', 2],
      'object-curly-spacing': ['error', 'always']
    }
  }
]
