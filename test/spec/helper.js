'use strict';

var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    async = require('async'),
    glob = require('glob'),
    semver = require('semver');

var {
  forEach,
  isFunction
} = require('min-dash');

var SchemaValidator = require('xsd-schema-validator');

var BPMN_XSD = require.resolve('bpmn-moddle/resources/bpmn/xsd/BPMN20.xsd');

var browser = require('../integration/browser');

var bpmnJsDistPath = path.resolve(__dirname, '../../dist/bpmn.js');


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
}

module.exports = Helper;


Helper.prototype.createTestTemplate = function(test, done) {

  try {

    // ensure directory exists
    mkdirp.sync(test.base);

    var templateContents = read(test.skeleton);

    var libraryPath = path.relative(path.dirname(test.html), bpmnJsDistPath);

    var testHtml = templateContents
      .replace(/\{\{test-bpmn-path\}\}/g, test.bpmn)
      .replace(/\{\{test-bpmn\}\}/g, test.bpmn && escapeString(read(test.bpmn)))
      .replace(/\{\{test-script-path\}\}/g, test.script)
      .replace(/\{\{test-script\}\}/g, test.script && read(test.script))
      .replace(/\{\{bpmn-js-path\}\}/g, libraryPath);

    // write test html
    write(test.html, testHtml);

    // write test descriptor
    write(test.baseName + '.json', JSON.stringify(test));

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

  /**
   * Make Windows happy. Returns relative path without backslashes.
   *
   * @param {String} absolutePath
   */
  function fixPath(absolutePath) {
    return path.relative(process.cwd(), absolutePath).replace(/\\/g, '/');
  }

  var test = {
    name: name,
    skeleton: skeleton,
    script: script && fixPath(script),
    bpmn: bpmn && fixPath(bpmn),
    baseName: fixPath(baseName),
    base: fixPath(path.dirname(baseName)),
    html: fixPath(baseName + '.html')
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
  forEach(results, function(subSteps, step) {
    forEach(subSteps, function(subStep, name) {
      expect(subStep.error).to.eql(undefined, 'expected <' + step + '#' + name + '> to succeed');
      expect(subStep.status).to.eql('SUCCESS', 'expected <' + step + '#' + name + '> to succeed');
    });
  });
};

Helper.prototype.validateBpmn20 = function(results, done) {

  var self = this;

  var validations = [];

  forEach(results, function(subSteps) {
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

    try {
      expect(result.valid).to.be.true;
    } catch (assertionError) {
      return done(assertionError);
    }

    return done();
  });
};

Helper.prototype.testExecute = function(script, bpmn, callback) {

  var self = this;

  if (isFunction(bpmn)) {
    callback = bpmn;
    bpmn = null;
  }

  var data = {
    name: path.posix.join(path.dirname(script), path.basename(script, '.js')),
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
          if (err) {
            return done(err);
          }

          try {
            self.validateBasic(results);
          } catch (assertionError) {
            return done(assertionError);
          }

          return done();
        }
      });

    });
  };

};

Helper.prototype.testImport = function(bpmn, validate) {

  var self = this;

  var data = {
    name: path.posix.join(path.dirname(bpmn), path.basename(bpmn, '.bpmn')),
    bpmn: bpmn,
    skeleton: 'test/integration/skeleton/import.html'
  };

  return function(done) {

    self.createTest(data, function(err, test) {

      if (err) {
        return done(err);
      }

      self.runTest(test, function(err, results) {

        if (err) {
          return done(err);
        }

        return validate.call(self, results, done);
      });

    });

  };

};


module.exports.describeSuite = function(suiteName, baseDir, validate, options = {}) {

  describe(suiteName, function() {

    if (options && options.timeout) {
      this.timeout(options.timeout);
    }

    var helper = new Helper(baseDir, suiteName);

    var diagramFiles = glob.sync(options.glob || '*.bpmn', { cwd: baseDir });

    diagramFiles.forEach(function(file) {

      it('import <' + file + '>', helper.testImport(file, validate));

    });

  });

};


/**
 * Execute test only if currently installed bpmn-js is of given version.
 *
 * @param {string} versionRange
 * @param {boolean} only
 */
module.exports.withBpmnJs = function(versionRange, only) {
  if (bpmnJsSatisfies(versionRange)) {
    return only ? it.only : it;
  } else {
    return it.skip;
  }
};

function bpmnJsSatisfies(versionRange) {
  const bpmnJsVersion = require('bpmn-js/package.json').version;

  return semver.satisfies(bpmnJsVersion, versionRange, { includePrerelease: true });
}