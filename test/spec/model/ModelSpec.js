'use strict';

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

  var helper = new Helper('modeler-test', 'test/fixtures');


  it('should execute testsuite', function(done) {
    helper.runSuite('model-js/*.js', 'test-model.html', function(err, results) {

      console.log('\n\n[XSD Validation]');
      _.forEach(results, function(r) {
        validateModel(r.base + '-export.bpmn', done, function(validateResult) {

          if(validateResult === 'SUCCESS') {
            console.log('Model ' + r.base + '-export.bpmn is valid');
          } else {
            console.error('Model ' + r.base + '-export.bpmn is invalid');
            throw new Error(r.base + '-export.bpmn failed');
          }
        });
      });
    });
  }, 20000);

});