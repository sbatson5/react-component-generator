const fs = require('fs');

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
  let dir = './components';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(`${dir}/${fileName}.js`, getFileContent(fileName), function (err) {
    if (err) throw err;
    console.log(`generated ${dir}/${fileName}.js`);
  });
}

function createRoute(fileName) {
  let dir = './routes';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(`${dir}/${fileName}.js`, getFileContent(fileName), function (err) {
    if (err) throw err;
    console.log(`generated ${dir}/${fileName}.js`);
  });
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

function upcase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
