'use strict';

var timeout = 20000;

var Helper = require('../Helper'),
    XMLHelper = require('../xml-helper'),
    SimpleBpmnModdle = require('../../../../bpmn-moddle');

var _ = require('lodash');

function fromFile(file, done) {
  var moddle = new SimpleBpmnModdle();

  XMLHelper.fromFile(moddle, file, done);
  return moddle;
}

function status(r) {
  if (r === 'SUCCESS') {
    return r;
  } else {
    return 'FAIL';
  }
}

function validateModel(file, done, validateResult) {
  fromFile(file, function(err, result) {
    if (err) {
      return done(err);
    }

    // when
    XMLHelper.toXML(result, { format: true }, function(err, xml) {
      XMLHelper.validate(xml, done, validateResult);
    });
  });
}


describe('modeler-test', function() {

  // Use this as iit does not respect the other async timeout syntax
  jasmine.getEnv().defaultTimeoutInterval = timeout;

  var helper = new Helper('modeler-test', 'test/fixtures');


  it('should execute testsuite', function(done) {

      helper.runSuite('model-js/*.js', 'test-model.html', function(err, results) {

      var completed = function(err) {
        if (err) {
          console.log('\n[Validation results]: FAILURE - Stopping tests');
          done(err);
        } else {
          console.log('\n[Validation results]: SUCCESS all ' + results.length + ' XSD validations completed successfully.');
          done();
        }
      };

      console.log('\n\n[XSD Validation]');
      var testStack = _.clone(results);

      (function runTests() {

        var r = testStack.pop();

        if (!r) {
          completed();
          return;
        }

        validateModel(r.base + '-export.bpmn', completed, function(validateResult) {
          if(validateResult === 'SUCCESS') {
            console.log('Model ' + r.base + '-export.bpmn is valid');
            runTests();
          } else {
            console.error('Model ' + r.base + '-export.bpmn is invalid');
            throw new Error(r.base + '-export.bpmn failed');
          }
        });
      })();
    });
  }, timeout);

});