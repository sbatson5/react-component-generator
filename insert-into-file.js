'use strict';

const fs = require('fs-extra');
const EOL = require('os').EOL;

module.exports = (fullPath, contentsToInsert, options = {}, overWrittenContent) => {
  let exists = fs.existsSync(fullPath);

  if (exists) {
    let originalContents = fs.readFileSync(fullPath, { encoding: 'utf8' });

    let contentsToWrite = overWrittenContent ? overWrittenContent : originalContents;

    let alreadyPresent = originalContents.indexOf(contentsToInsert) > -1;
    let insert = !alreadyPresent;
    let insertBehavior = options.before ? 'before' : 'after';

    if (options.force) { insert = true; }

    if (insert) {
      let contentMarker = options[insertBehavior];
      let leadingIndentation = '';
      if (contentMarker instanceof RegExp) {
        let matches = contentsToWrite.match(contentMarker);
        if (matches) {
          contentMarker = matches[0];
        }
      }
      let contentMarkerIndex = contentsToWrite.indexOf(contentMarker);
      if (insertBehavior === 'after') {
        let fileUpToThisPoint = contentsToWrite.slice(0, contentMarkerIndex);
        let asArray = fileUpToThisPoint.split('\n').reverse();
        let previousLineIndentation = asArray[0];
        if (previousLineIndentation && previousLineIndentation.length) {
          leadingIndentation = previousLineIndentation + '  ';
        }
      }

      if (contentMarkerIndex !== -1) {
        let insertIndex = contentMarkerIndex;
        if (insertBehavior === 'after') {
          contentsToInsert = '\n' + leadingIndentation + contentsToInsert;
          insertIndex += contentMarker.length;
        }

        let addEOL = insertBehavior === 'before' ? EOL : '';

        contentsToWrite = contentsToWrite.slice(0, insertIndex) +
          contentsToInsert + addEOL +
          contentsToWrite.slice(insertIndex);
      }
    }

    if (contentsToWrite !== originalContents) {
      return new Promise(async (resolve) => {
        await fs.outputFile(fullPath, contentsToWrite);
        let data = await fs.readFile(fullPath, 'utf8');
        resolve(data);
      });
    }
  }
}
