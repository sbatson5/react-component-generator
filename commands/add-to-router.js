const insertIntoFile = require('../insert-into-file');
const DEFAULT_FOLDER = './src';

module.exports = async (fileName, directory = 'routes') => {
  let [start, end] = fileName.split('-');
  let routeName = `${upcase(start)}${upcase(end)}`;
  let importStatement = `import ${routeName} from './${directory}/${fileName}';`;
  let routeStatement = `<Route path="/${fileName}" exact component={${routeName}} />`

  let updatedFile = await insertIntoFile(`${DEFAULT_FOLDER}/App.js`, importStatement, {
    after: /(import.+?;)/
  });

  await insertIntoFile(`${DEFAULT_FOLDER}/App.js`, routeStatement, {
    after: /(<div className="App.+?">)/
  }, updatedFile);
}

function upcase(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
