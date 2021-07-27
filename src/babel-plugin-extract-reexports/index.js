const { declare } = require('@babel/helper-plugin-utils');

class BabelPluginExtractExportNames {
  constructor() {
    const exports = [];
    this.state = { exports };

    this.plugin = declare((api) => {
      api.assertVersion(7);

      const handleSpecifiers = (node) => {
        if (!node || !node.source || !('value' in node.source)) {
          return;
        }

        const source = node.source.value;
        const specifiers = node.specifiers || [];

        specifiers.forEach((specifier) => {
          exports.push({
            exportedName: specifier.exported.name,
            source,
          });
        });
      };

      return {
        visitor: {
          ExportNamedDeclaration(path) {
            handleSpecifiers(path.node);
          },
        },
      };
    });
  }
}

module.exports = BabelPluginExtractExportNames;
