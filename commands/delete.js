const fs = require('fs-extra');
const DEFAULT_FOLDER = './src';

module.exports = (fileType, fileName) => {
  if (!fileName) return;

  switch (fileType) {
    case 'component':
      deleteComponent(fileName);
      break;
    case 'route':
      deleteRoute(fileName);
      break;
    default:
      break;
  }
}

function deleteComponent(fileName) {
  let dir = 'components';
  _deleteFile(dir, fileName);
}

function deleteRoute(fileName) {
  let dir = 'routes';
  _deleteFile(dir, fileName);

  _removeFromRouter(fileName);
}

function _removeFromRouter(fileName) {
}

function _deleteFile(dir, fileName) {
  let fullPath = `${DEFAULT_FOLDER}/${dir}/${fileName}.js`;

  fs.unlink(fullPath, (err) => {
    if (err) {
      return console.log(`Could not find ${fileName}`);
    };
    console.log(`${fileName} was deleted`);
  });
}

function upcase(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
