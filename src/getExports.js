const babel = require('@babel/core');
const BabelPluginExtractReexports = require('./babel-plugin-extract-reexports');

function getExports(code) {
  const extractor = new BabelPluginExtractReexports();

  babel.transformSync(code, {
    plugins: [extractor.plugin],
    presets: ['@babel/env', '@babel/preset-react'],
  });

  return extractor.state.exports;
}

module.exports = { getExports };
