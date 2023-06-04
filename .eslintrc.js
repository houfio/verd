/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc'
        }
      }
    ],
    'react-hooks/exhaustive-deps': 'off'
  }
};
