const babylon = require('babylon');
const {default: traverse} = require('babel-traverse');
const fs = require('fs');
const t = require('babel-types');

let modules;

function getModules() {
  const code = fs.readFileSync(require.resolve('react-native/Libraries/react-native/react-native-implementation'));
  const ast = babylon.parse(code.toString(), {sourceType: 'module'});
  const modules = {};
  traverse(ast, {
    Identifier(path) {
      if (!t.isIdentifier(path.node, { name: 'require' })) return;
      const args = path.container.arguments;
      if (!t.isStringLiteral(args[0])) return;
      const {value} = args[0];
      if (!t.isReturnStatement(path.parentPath.container)) return;
      if (!t.isObjectMethod(path.parentPath.parentPath.parentPath.container, {kind: 'get'})) return;
      if (!t.isIdentifier(path.parentPath.parentPath.parentPath.container.key)) return;
      const {name} = path.parentPath.parentPath.parentPath.container.key;
      if (value.startsWith('../')) modules[name] = value.replace(/^\.\.\/(.*)$/, 'react-native/Libraries/$1');
    }
  });
  return modules;
}

module.exports = function(importName) {
  if (!modules) modules = getModules();
  if (importName in modules) return modules[importName];
  return importName;
};
