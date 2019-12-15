module.exports = {
  src: [
    '.',
  ],
  mode: 'modules',
  includeDeclarations: true,
  tsconfig: 'tsconfig.json',
  out: './docs',
  excludePrivate: true,
  excludeProtected: false,
  excludeExternals: true,
  readme: 'README.md',
  name: 'mn-utils',
  ignoreCompilerErrors: true,
  plugin: 'none',
  listInvalidSymbolLinks: true,
  exclude: [
    'node_modules',
    '**/*.tmp*',
  ],
};
