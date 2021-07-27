const babel = require("@babel/core");

const BabelPluginExtractImportNames = require("..");

const transform = (value) => {
  const plugin = new BabelPluginExtractImportNames();

  babel.transformSync(value, {
    configFile: false,
    plugins: [plugin.plugin],
  });

  return plugin.state.imports;
};

describe("babel-plugin-extract-import-names", () => {
  test("should capture an empty list on an empty file", () => {
    expect(transform("")).toEqual([]);
  });

  test("should capture an empty list if nothing is imported", () => {
    expect(transform("console.log(1)")).toEqual([]);
  });

  test("should capture a destructuring", () => {
    expect(transform('import {name1} from "m"')).toEqual([
      {
        importedName: "name1",
        source: "m",
      },
    ]);
  });

  test("should capture a destructuring w/ imported name (not local)", () => {
    expect(transform('import {x as name1} from "m"')).toEqual([
      {
        importedName: "x",
        source: "m",
      },
    ]);
  });

  test("should capture destructuring, but not default", () => {
    expect(transform('import name1, {x as name2} from "m"')).toEqual([
      {
        importedName: "x",
        source: "m",
      },
    ]);
  });
});
