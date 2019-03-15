const fs = require('fs-extra');
const DEFAULT_FOLDER = './src';
const insertIntoFile = require('../insert-into-file');

module.exports = (fileType, fileName) => {
  if (!fileName) return;

  switch (fileType) {
    case 'component':
      createComponent(fileName);
      break;
    case 'route':
      createRoute(fileName);
      break;
    default:
      break;
  }
}

function createComponent(fileName) {
  let dir = 'components';
  _createFile(dir, fileName);
}

function createRoute(fileName) {
  let dir = 'routes';
  _createFile(dir, fileName);

  _addToRouter(fileName);
}

async function _addToRouter(fileName) {
  let [start, end] = fileName.split('-');
  let routeName = `${upcase(start)}${upcase(end)}`;
  let importStatement = `\nimport ${routeName} from './routes/${fileName}';`;
  let routeStatement = `\n\t\t\t\t\t<Route path="/${fileName}" exact component={${routeName}} />`

  let updatedFile = await insertIntoFile(`${DEFAULT_FOLDER}/App.js`, importStatement, {
    after: /(import.+?;)/
  });

  await insertIntoFile(`${DEFAULT_FOLDER}/App.js`, routeStatement, {
    after: /(<div className="App.+?">)/
  }, updatedFile);
}

function _createFile(dir, fileName) {
  let directories = [DEFAULT_FOLDER, dir, ...fileName.split('/')];
  directories.pop();
  _createDirectoryIfItDoesntExist(directories.join('/'));

  let fullPath = `${DEFAULT_FOLDER}/${dir}/${fileName}.js`;

  if (fs.existsSync(fullPath)) {
    console.log(`${fileName} already exists`);
    return;
  }

  fs.writeFile(fullPath, getFileContent(fileName), function (err) {
    if (err) throw err;
    console.log(`generated ${dir}/${fileName}.js`);
  });
}

function _createDirectoryIfItDoesntExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getFileContent(fileName) {
  let [start, end] = fileName.split('-');
  let functionName = `${start}${upcase(end)}`;
  return `import React from 'react';

export default function ${functionName}({}) {
  return (
    <div>
    </div>
  );
}`
}

function upcase(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
