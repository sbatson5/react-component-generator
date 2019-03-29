const fs = require('fs-extra');
const DEFAULT_FOLDER = './src';
const addToRouter = require('./add-to-router');

module.exports = (fileType, fileName, params, settings) => {
  if (!fileName) return;

  switch (fileType) {
    case 'component':
      createComponent(fileName, params, settings);
      break;
    case 'route':
      createRoute(fileName, params, settings);
      break;
    default:
      break;
  }
}

function createComponent(fileName, params = {}, settings = {}) {
  let { componentType, componentsDirectory } = settings;
  let dir = componentsDirectory || 'components';
  let isClass = params.class || componentType === 'class';

  _createFile(dir, fileName, isClass);
}

function createRoute(fileName, params = {}, settings = {}) {
  let { componentType, routesDirectory } = settings;

  let dir = routesDirectory || 'routes';

  let isClass = params.class || componentType === 'class';

  _createFile(dir, fileName, isClass);

  addToRouter(fileName, dir);
}

function _createFile(dir, fileName, isClassComponent) {
  let directories = [DEFAULT_FOLDER, dir, ...fileName.split('/')];
  directories.pop();
  _createDirectoryIfItDoesntExist(directories.join('/'));

  let fullPath = `${DEFAULT_FOLDER}/${dir}/${fileName}.js`;

  if (fs.existsSync(fullPath)) {
    console.log(`${fileName} already exists`);
    return;
  }

  fs.writeFile(fullPath, getFileContent(fileName, isClassComponent), function (err) {
    if (err) throw err;
    console.log(`generated ${dir}/${fileName}.js`);
  });
}

function _createDirectoryIfItDoesntExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getFileContent(fileName, isClassComponent) {
  if (isClassComponent) {
    return classComponent(fileName);
  } else {
    return functionComponent(fileName);
  }
}

function classComponent(fileName) {
  let [start, end] = fileName.split('-');
  let className = `${upcase(start)}${upcase(end)}`;
  return `import React, { Component } from 'react';

class ${className} extends Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

export default ${className};`
}

function functionComponent(fileName) {
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
