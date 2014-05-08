'use strict';

var mkdirp = require('mkdirp'),
    fs = require('fs'),
    browser = require('../integration/browser/run'),
    path = require('path'),
    glob = require('glob'),
    join = path.join;

function log() {
  // console.log.apply(console, Array.prototype.slice.call(arguments));
}

function readFile(f) {
  return fs.readFileSync(f, { encoding: 'utf-8' });
}


function Helper(suiteName, basePath) {

  this.suiteName = suiteName;
  this.basePath = basePath;

  this.tmpDir = 'tmp/integration/' + suiteName;

  log('use temp dir %s', this.tmpDir);
  mkdirp.sync(this.tmpDir);
}

Helper.prototype.createTestPage = function(file) {

  var suiteName = this.suiteName;
  var tmpDir = this.tmpDir;
  var basePath = this.basePath;

  log(file);

  var xml = readFile(file);
  var name = path.basename(file, '.bpmn');

  var library = fs.realpathSync('../bpmn-js/dist/bpmn.js');

  var template = readFile(join(__dirname, '../integration', 'test.html'));

  var testFileHTML =
    template
      .replace('{{bpmnFile}}', suiteName + '/' + name)
      .replace('{{bpmnJS}}', library)
      .replace('{{bpmnXml}}', xml.replace(/'/g, '\\\'').replace(/[\n\r]+/g, '\\n'));

  var relativePath = path.dirname(tmpDir + '/' + path.relative(basePath, file)) + '/' + name;

  mkdirp.sync(path.dirname(relativePath));

  var testFileName = relativePath + '.html';

  fs.writeFileSync(testFileName, testFileHTML);

  return {
    file: file,
    name: name,
    base: relativePath,
    testFile: testFileName
  };
};

Helper.prototype.prepareTestFiles = function(pattern, done) {

  var tmpDir = this.tmpDir;
  var suiteName = this.suiteName;

  var path = this.basePath + '/' + pattern;

  var self = this;

  log('glob %s', path);

  glob(path, function(err, files) {

    if (err) {
      return done(err);
    }

    var scripts = [];

    files.forEach(function(f) {
      log('test %s', f);
      scripts.push(self.createTestPage(f));
    });

    var descriptor = join(tmpDir, 'results.json');

    fs.writeFileSync(descriptor, JSON.stringify(scripts));

    done(null, descriptor);
  });
};

Helper.prototype.runPhantom = function(descriptor, done) {

  var tmpDir = this.tmpDir;

  browser(path.resolve(__dirname, '../integration/run-tests.js'), [ descriptor ], function(err) {

    if (err) {
      return done(err);
    }

    var descriptor = join(tmpDir, 'results.json');
    var results = JSON.parse(fs.readFileSync(descriptor, { encoding: 'utf-8' }));

    done(null, results);
  });
};

Helper.prototype.runSuite = function(pattern, done) {

  var self = this;

  this.prepareTestFiles(pattern, function(err, descriptor) {

    if (err) {
      return done(err);
    }

    self.runPhantom(descriptor, done);
  });
};


module.exports = Helper;