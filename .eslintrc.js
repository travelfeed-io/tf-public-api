module.exports = {
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:security/recommended',
  ],
  plugins: ['prettier', 'security'],
};
