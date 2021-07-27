const babel = require('@babel/core');
const BabelPluginExtractImports = require('./babel-plugin-extract-imports');

function getImports(code) {
  const extractor = new BabelPluginExtractImports();

  babel.transformSync(code, {
    plugins: [extractor.plugin],
    presets: ['@babel/env', '@babel/preset-react'],
  });

  return extractor.state.imports;
}

module.exports = { getImports };
