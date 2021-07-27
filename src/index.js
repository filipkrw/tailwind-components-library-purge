const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { getImports } = require('./getImports');
const { getExports } = require('./getExports');

function componentsLibraryPurge(pattern, srcIndexPath) {
  const usedComponents = getUsedComponentsNames(pattern);
  const exportedComponents = getExportedComponents(srcIndexPath);

  const srcPath = path.dirname(srcIndexPath);
  const purge = usedComponents.map((componentName) => {
    const { source } = exportedComponents.find(
      ({ exportedName }) => exportedName === componentName,
    );
    return path.join(srcPath, source) + '.{js,jsx,ts,tsx}';
  });

  return purge;
}

function getUsedComponentsNames(pattern) {
  return glob
    .sync(pattern)
    .map((file) => getImports(fs.readFileSync(file)))
    .reduce((imports, currentImport) => [...imports, ...currentImport], [])
    .filter((currentImport) => currentImport.source === 'components')
    .map(({ importedName }) => importedName)
    .filter(
      (component, index, components) => components.indexOf(component) === index,
    );
}

function getExportedComponents(indexPath) {
  return getExports(fs.readFileSync(indexPath));
}

module.exports = { componentsLibraryPurge };
