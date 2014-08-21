'use strict';

var mkdirp = require('mkdirp'),
    fs = require('fs'),
    browser = require('../integration/browser/run'),
    path = require('path'),
    glob = require('glob'),
    join = path.join;

function log() {
  console.log.apply(console, Array.prototype.slice.call(arguments));
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

Helper.prototype.createTestPage = function(file, htmlTemplate) {

  var suiteName = this.suiteName;
  var tmpDir = this.tmpDir;
  var basePath = this.basePath;

  var bpmnContent = readFile(file);
  var name = path.basename(file, '.bpmn');

  var library = fs.realpathSync('dist/bpmn.js');

  var template = readFile(join(__dirname, '../integration', htmlTemplate));

  var testFileHTML =
    template
      .replace('{{bpmnFile}}', suiteName + '/' + name)
      .replace('{{bpmnJS}}', library)
      .replace('{{bpmnXml}}', bpmnContent.replace(/'/g, '\\\'').replace(/[\n\r]+/g, '\\n'))
      .replace('{{testScript}}', bpmnContent);

  var relativePath = path.dirname(tmpDir + '/' + path.relative(basePath, file)) + '/' + name;

  mkdirp.sync(path.dirname(relativePath));

  var testFileName = relativePath + '.html';

  log('[prepare-tests] created test file', testFileName);

  fs.writeFileSync(testFileName, testFileHTML);

  return {
    file: file,
    name: name,
    base: relativePath,
    testFile: testFileName
  };
};

Helper.prototype.prepareTestFiles = function(pattern, htmlTemplate, done) {

  var tmpDir = this.tmpDir;
  var path = this.basePath + '/' + pattern;
  var self = this;

  log('[prepare-tests] files %s', path);

  glob(path, function(err, files) {

    if (err) {
      return done(err);
    }

    var scripts = [];

    files.forEach(function(f) {
      scripts.push(self.createTestPage(f, htmlTemplate));
    });

    var descriptor = join(tmpDir, 'results.json');

    log('[prepare-tests] write test descriptor', descriptor);
    fs.writeFileSync(descriptor, JSON.stringify(scripts));

    done(null, descriptor);
  });
};

Helper.prototype.runPhantom = function(descriptor, done) {

  var tmpDir = this.tmpDir;

  log('[run-tests] running via phantomjs ...');

  browser(path.resolve(__dirname, '../integration/run-tests.js'), [ descriptor ], function(err) {

    log('[run-tests] done.');

    if (err) {
      return done(err);
    }

    var descriptor = join(tmpDir, 'results.json');
    var results = JSON.parse(fs.readFileSync(descriptor, { encoding: 'utf-8' }));

    done(null, results);
  });
};

Helper.prototype.runSuite = function(pattern, htmlTemplate, done) {

  var self = this;

  log('[suite] %s', pattern);

  this.prepareTestFiles(pattern, htmlTemplate, function(err, descriptor) {

    if (err) {
      return done(err);
    }

    self.runPhantom(descriptor, done);
  });
};


module.exports = Helper;