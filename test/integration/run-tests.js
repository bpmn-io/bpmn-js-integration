var page = require('webpage').create(),
    system = require('system'),
    fs = require('fs');

var configFile = system.args[1];

if (!configFile) {

  console.error('must specify test configuration file');
  phantom.exit(1);
}

var tests;

try {
  tests = JSON.parse(fs.read(configFile));
} catch (e) {
  console.error('Failed to parse ' + configFile);
  phantom.exit(1);
}

var PATTERN = /^([\w]+) ([\w]+) (SUCCESS|FAIL)(?:\n*([^]+))?$/;

var FAIL = 'FAIL';
var SUCCESS = 'SUCCESS';

var idx = -1,
    test,
    results;


function next() {

  idx++;
  results = {};
  test = tests[idx];

  if (!test) {
    fs.write(configFile, JSON.stringify(tests), 'w');

    log('All done. Exiting.');
    phantom.exit();
  } else {
    executeTest(test);
  }

}

function log(str) {

}

function saveAndNext() {
  test.results = results;
  log('done.');

  next();
}

page.viewportSize = {
  width: 1600,
  height: 1200
};

page.onConsoleMessage = function(msg) {

  var baseName = test.base;

  if (msg == 'done') {
    return saveAndNext();
  }

  var match = PATTERN.exec(msg);

  if (!match) {
    log('unexpected message: ' + msg);
  } else {
    var phase = match[1],
        category = match[2],
        status = match[3],
        payload = match[4];

    var result;
    var testName = phase + '-' + category;

    if (status == FAIL) {
      log('test FAIL ' + testName);

      result = { error: payload };
    } else {
      log('test SUCCESS ' + testName);

      result = SUCCESS;

      switch(testName) {
        case 'import-bpmn':
          page.render(baseName + '-import.png');
          break;

        case 'export-bpmn':
          fs.write(baseName + '-export.bpmn', payload);
          break;

        case 'export-svg':
          fs.write(baseName + '-export.svg', payload);
          break;
      }
    }

    results[testName] = result;
  }
};

function executeTest(test) {

  var fileName = test.testFile;

  log('execute ' + test.name);

  page.open(fileName, function(status) {
    log('loaded ' + test.name);
  });
}

next();