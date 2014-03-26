var mkdirp = require('mkdirp'),
    fs = require('fs'),
    browser = require('../../integration/browser/run'),
    path = require('path'),
    glob = require('glob'),
    join = path.join;


var tmpDir = 'tmp/integration/miwg/';

mkdirp.sync(tmpDir);

function readFile(f) {
  return fs.readFileSync(f, { encoding: 'utf-8' });
}


describe('bpmn-miwg', function() {


  function createTestPage(suite, file) {

    var xml = readFile(file);
    var name = path.basename(file, '.bpmn');

    var simpleName = join(suite, name);

    var library = fs.realpathSync('../bpmn-js/dist/bpmn.js');

    var template = readFile(join(__dirname, '../../integration', 'test.html'));

    var testFileHTML =
      template
        .replace('{{bpmnFile}}', simpleName)
        .replace('{{bpmnJS}}', library)
        .replace('{{bpmnXml}}', xml.replace(/'/g, '\\\'').replace(/[\n\r]+/g, '\\n'));

    mkdirp.sync(join(tmpDir, suite));

    var testFilePath = join(tmpDir, suite, name + '.html');
    var basePath = join(tmpDir, suite, name);

    fs.writeFileSync(testFilePath, testFileHTML);

    return {
      file: file,
      name: name,
      base: basePath,
      testFile: testFilePath
    };
  }

  function prepareTestFiles(suiteName, done) {

    var path = '../bpmn-miwg-test-suite/' + suiteName + '/Reference/*.bpmn';

    glob(path, function(err, files) {

      if (err) {
        return done(err);
      }

      var scripts = [];

      files.forEach(function(f) {
        scripts.push(createTestPage(suiteName, f));
      });

      var descriptor = join(tmpDir, suiteName, 'tests.json');

      fs.writeFileSync(descriptor, JSON.stringify(scripts));

      done(null, descriptor);
    });
  }

  function runPhantom(descriptor, done) {
    browser(path.resolve(__dirname, '../../integration/run-tests.js'), [ descriptor ], done);
  }

  function runSuite(suiteName, done) {

    prepareTestFiles(suiteName, function(err, descriptor) {

      if (err) {
        return done(err);
      }

      runPhantom(descriptor, done);
    });
  }

  it('should execute A testsuite', function(done) {

    runSuite('A - Fixed Digrams with Variations of Attributes', done);
  }, 20000);

  it('should execute B testsuite', function(done) {

    runSuite('B - Validate that tool covers conformance class set', done);
  }, 20000);
});