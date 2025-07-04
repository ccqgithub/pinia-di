module.exports = {
  root: true,
  env: {
    node: true
  },
  ignorePatterns: ['!.*.js', 'dist/**.*', 'types'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    'no-prototype-builtins': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
      // parser: '@babel/eslint-parser',
      plugins: ['import', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'prettier'
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-prototype-builtins': 'off'
      }
    }
  ]
};
