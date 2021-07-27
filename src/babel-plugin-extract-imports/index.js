const { declare } = require("@babel/helper-plugin-utils");

class BabelPluginExtractImportNames {
  constructor() {
    const imports = [];
    this.state = { imports };

    this.plugin = declare((api) => {
      api.assertVersion(7);

      return {
        visitor: {
          ImportDeclaration(path) {
            const source = path.node.source.value;

            path.traverse({
              Identifier(path) {
                if (path.key === "imported") {
                  imports.push({
                    importedName: path.node.name,
                    source,
                  });
                }
              },
            });
          },
        },
      };
    });
  }
}

module.exports = BabelPluginExtractImportNames;
