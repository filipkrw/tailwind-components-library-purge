const babel = require("@babel/core");

const BabelPluginExtractExportNames = require("..");

const transform = (value) => {
  const plugin = new BabelPluginExtractExportNames();

  babel.transformSync(value, { configFile: false, plugins: [plugin.plugin] });

  return plugin.state.exports;
};

describe("babel-plugin-extract-export-names", () => {
  test("should capture an empty list on an empty file", () => {
    expect(transform("")).toEqual([]);
  });

  test("should capture an empty list if nothing is exported", () => {
    expect(transform("console.log(1)")).toEqual([]);
  });

  test("should capture reexported as a whole with rename", () => {
    expect(transform('export * as name1 from "module"')).toEqual([
      {
        exportedName: "name1",
        source: "module",
      },
    ]);
  });

  test("should capture reexported destructuring", () => {
    expect(transform('export {name1} from "module"')).toEqual([
      {
        exportedName: "name1",
        source: "module",
      },
    ]);
  });

  test("should capture reexported destructuring w/ rename", () => {
    expect(transform('export {name1 as foo} from "module"')).toEqual([
      {
        exportedName: "foo",
        source: "module",
      },
    ]);
  });

  test("should capture reexported as a default whole", () => {
    expect(transform('export {default} from "module"')).toEqual([
      {
        exportedName: "default",
        source: "module",
      },
    ]);
  });

  test("should capture reexported desctructuring w/ non-default", () => {
    expect(transform('export {default as foo} from "module"')).toEqual([
      {
        exportedName: "foo",
        source: "module",
      },
    ]);
  });
});
