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
    let insertBehavior = 'end';

    if (options.before) { insertBehavior = 'before'; }
    if (options.after) { insertBehavior = 'after'; }

    if (options.force) { insert = true; }

    if (insert) {
      if (insertBehavior === 'end') {
        contentsToWrite += contentsToInsert;
      } else {
        let contentMarker = options[insertBehavior];
        if (contentMarker instanceof RegExp) {
          let matches = contentsToWrite.match(contentMarker);
          if (matches) {
            contentMarker = matches[0];
          }
        }
        let contentMarkerIndex = contentsToWrite.indexOf(contentMarker);

        if (contentMarkerIndex !== -1) {
          let insertIndex = contentMarkerIndex;
          if (insertBehavior === 'after') { insertIndex += contentMarker.length; }

          contentsToWrite = contentsToWrite.slice(0, insertIndex) +
            contentsToInsert + EOL +
            contentsToWrite.slice(insertIndex);
        }
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
