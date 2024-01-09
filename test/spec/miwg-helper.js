/* eslint-env node */

'use strict';

const glob = require('glob');
const { join } = require('path');

module.exports.resourcePath = resourcePath;
module.exports.submissionPath = submissionPath;

function resourcePath(file) {
  let path = process.env.MIWG_PATH || '../bpmn-miwg-test-suite';

  if (!path) {
    return 'non-existing-directory';
  }

  if (file) {
    path = path + '/' + file;
  }

  return path;
}

function submissionPath() {
  const baseDir = resourcePath();

  const submission = glob.sync('bpmn.io (Camunda Modeler) */', { cwd: baseDir })[0];

  return join(baseDir, submission);
}
