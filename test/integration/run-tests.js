/* global phantom */

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
  log('parsed config file ' + configFile);
  tests = JSON.parse(fs.read(configFile));
} catch (e) {
  console.error('Failed to parse ' + configFile);
  phantom.exit(1);
}

var PATTERN = /^snapshot ([\w]+) ([\w]+) (SUCCESS|FAIL)(?:\n*([^]+))?$/;

var FAIL = 'FAIL';
var SUCCESS = 'SUCCESS';

var idx = -1,
    test,
    results,
    snapshot;


function next() {

  idx++;
  results = {};
  snapshot = 0;
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
  // console.log.apply(console, Array.prototype.slice.call(arguments));
}

function saveAndNext() {
  test.results = results;
  log('done.');

  next();
}

page.viewportSize = {
  width: 1024,
  height: 768
};

page.onConsoleMessage = function(msg) {

  var baseName = test.baseName;

  if (msg === 'done') {
    return saveAndNext();
  }

  var match = PATTERN.exec(msg);

  if (!match) {
    log('unexpected message: ' + msg);
  } else {
    var name = match[1],
        element = match[2],
        status = match[3],
        payload = match[4];

    var step = snapshot + '-' + name;
    var result = results[step];
    if (!result) {
      snapshot++;
      step = snapshot + '-' + name;
      result = results[step] = {};
    }

    if (status === FAIL) {
      log('test FAIL ' + step + ' ' + element + ': ' + payload);
      result[element] = { status: 'FAILED', error: payload };
    } else {
      log('test FAIL ' + step + ' ' + element);

      switch(element) {
        case 'reached':
          result[element] = { status: 'SUCCESS', file: baseName + '-' + step + '.png' };
          page.render(baseName + '-' + step + '.png');
          break;

        case 'bpmn':
          result[element] = { status: 'SUCCESS', file: baseName + '-' + step + '.bpmn' };
          fs.write(baseName + '-' + step + '.bpmn', payload);
          break;

        case 'svg':
          result[element] = { status: 'SUCCESS', file: baseName + '-' + step + '.svg' };
          fs.write(baseName + '-' + step + '.svg', payload);
          break;

        default:
          console.log('unknown', msg);
      }
    }
  }
};

function executeTest(test) {

  var fileName = test.html;

  log('execute ' + test.name);

  page.open(fileName, function(status) {
    log('loaded ' + test.name);
  });
}

next();
