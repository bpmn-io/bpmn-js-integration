'use strict';

function resourcePath(file) {
  var path = process.env.MIWG_PATH || '../bpmn-miwg-test-suite';

  if (!path) {
    return 'non-existing-directory';
  }

  if (file) {
    path = path + '/' + file;
  }

  return path;
}

module.exports.resourcePath = resourcePath;