module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'google',
  ],
  rules: {
    "operator-linebreak": [ "error", "before" ],
    "require-jsdoc": ["error", {
      require: {
        FunctionDeclaration: false,
        MethodDefinition: false,
        ClassDeclaration: false,
        ArrowFunctionExpression: false,
        FunctionExpression: false,
      },
    }],
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [
    '@typescript-eslint',
  ],
};
