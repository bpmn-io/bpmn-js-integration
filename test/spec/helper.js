'use strict';

var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    _ = require('lodash'),
    async = require('async'),
    glob = require('glob');


var SchemaValidator = require('xsd-schema-validator');

var BPMN_XSD = require.resolve('bpmn-moddle/resources/bpmn/xsd/BPMN20.xsd');

var browser = require('../integration/browser');


function escapeString(str) {
  return str.replace(/'/g, '\\\'').replace(/[\n\r]+/g, '\\n');
}

function read(file) {
  return fs.readFileSync(file, 'utf-8');
}

function write(file, contents) {
  fs.writeFileSync(file, contents);
}

function Helper(basedir, suiteName) {
  this._basedir = basedir;
  this._suiteName = suiteName || path.basename(basedir);

  // allow exposing execute as a utility by retaining <this>
  this.testExecute = this.testExecute.bind(this);

  this.testImport = this.testImport.bind(this);
  this.testBatchImport = this.testBatchImport.bind(this);
}

module.exports = Helper;


Helper.prototype.createTestTemplate = function(test, done) {

  try {
    // ensure directory exists
    mkdirp.sync(test.base);

    var templateContents = read(test.skeleton);

    var libraryPath = fs.realpathSync('dist/bpmn.js');

    var testHtml = templateContents
                     .replace(/\{\{test-bpmn-path\}\}/g, test.bpmn)
                     .replace(/\{\{test-bpmn\}\}/g, test.bpmn && escapeString(read(test.bpmn)))
                     .replace(/\{\{test-script-path\}\}/g, test.script)
                     .replace(/\{\{test-script\}\}/g, test.script && read(test.script))
                     .replace(/\{\{bpmn-js-path\}\}/g, libraryPath);

    // write test html
    write(test.html, testHtml);

    // write test descriptor
    write(test.baseName + '.json', test);

    done(null, test);
  } catch (e) {
    done(e);
  }
};

var EMBEDDED_BPMN = /\/\*\s*\w*@bpmn\s+([\w.]+)\s*\w*\*\//;

Helper.prototype.createTest = function(options, done) {

  var script = options.script && path.resolve(this._basedir, options.script),
      bpmn = options.bpmn && path.resolve(this._basedir, options.bpmn),
      skeleton = options.skeleton,
      name = options.name;

  if (!skeleton) {
    return done(new Error('must specify test skeleton'));
  }

  if (!name) {
    return done(new Error('must specifiy a test name'));
  }

  if (!script && !bpmn) {
    return done(new Error('must specify script or bpmn'));
  }

  var baseName = path.resolve(path.join('tmp/integration', this._suiteName, name));

  if (script && !bpmn) {
    var embeddedBpmn = EMBEDDED_BPMN.exec(read(script));
    if (embeddedBpmn) {
      bpmn = path.resolve(path.dirname(script), embeddedBpmn[1]);
    }
  }

  if (!bpmn) {
    bpmn = path.resolve('test/integration/skeleton/initial.bpmn');
  }

  var test = {
    name: name,
    skeleton: skeleton,
    script: script,
    bpmn: bpmn,
    baseName: baseName,
    base: path.dirname(baseName),
    html: baseName + '.html'
  };

  this.createTestTemplate(test, done);
};

Helper.prototype.runTests = function(tests, descriptorLocation, done) {

  var browserScriptPath = path.resolve('test/integration/run-tests.js');

  write(descriptorLocation, JSON.stringify(tests));

  browser.run(browserScriptPath, [ descriptorLocation ], function(err) {

    if (err) {
      return done(err);
    }

    tests = JSON.parse(read(descriptorLocation));

    done(null, tests);
  });
};

Helper.prototype.runTest = function(test, done) {

  var descriptorLocation = test.baseName + '.json';

  this.runTests([ test ], descriptorLocation, function(err, tests) {
    if (err) {
      return done(err);
    }

    return done(null, tests[0].results);
  });
};

Helper.prototype.validateBasic = function(results) {
  _.forEach(results, function(subSteps, step) {
    _.forEach(subSteps, function(subStep, name) {
      expect(subStep.error).to.eql(undefined, 'expected <' + step + '#' + name + '> to succeed');
      expect(subStep.status).to.eql('SUCCESS', 'expected <' + step + '#' + name + '> to succeed');
    });
  });
};

Helper.prototype.validateBpmn20 = function(results, done) {

  var self = this;

  var validations = [];

  _.forEach(results, function(subSteps, step) {
    if (subSteps['bpmn']) {
      validations.push(function(done) {
        self.validateXSD(read(subSteps['bpmn'].file), done);
      });
    }
  });

  async.series(validations, done);
};

Helper.prototype.validateXSD = function(xml, done) {

  if (!xml) {
    return done(new Error('XML is not defined'));
  }

  SchemaValidator.validateXML(xml, BPMN_XSD, function(err, result) {

    if (err) {
      return done(err);
    }

    expect(result.valid).to.be.true;
    done();
  });
};

Helper.prototype.testExecute = function(script, bpmn, callback) {

  var self = this;

  if (_.isFunction(bpmn)) {
    callback = bpmn;
    bpmn = null;
  }

  var data = {
    name: path.join(path.dirname(script), path.basename(script, '.js')),
    script: script,
    bpmn: bpmn,
    skeleton: 'test/integration/skeleton/modeling.html'
  };

  return function(done) {

    self.createTest(data, function(err, test) {

      if (err) {
        return done(err);
      }

      self.runTest(test, function(err, results) {

        if (callback) {
          return callback(err, results, done);
        } else {
          self.validateBasic(results);
          done(err);
        }
      });

    });
  };
};

Helper.prototype.testImport = function(bpmn, callback) {

  var self = this;

  var data = {
    name: path.join(path.dirname(bpmn), path.basename(bpmn, '.bpmn')),
    bpmn: bpmn,
    skeleton: 'test/integration/skeleton/import.html'
  };

  return function(done) {

    self.createTest(data, function(err, test) {

      if (err) {
        return done(err);
      }

      self.runTest(test, function(err, results) {

        if (callback) {
          return callback(err, results, done);
        } else {
          self.validateBasic(results);
          done(err);
        }
      });

    });
  };
};

Helper.prototype.testBatchImport = function(pattern, callback) {

  var self = this;

  return function(done) {

    var tests = [];

    var files = glob.sync(pattern, { cwd: self._basedir });

    _.forEach(files, function(f) {
      tests.push(self.testImport(f));
    });

    async.series(tests, done);
  };
};