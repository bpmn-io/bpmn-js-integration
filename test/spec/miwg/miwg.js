var Helper = require('../helper');

var MiwgHelper = require('../miwg-helper');


describe('bpmn-miwg-test-suite', function() {

  var helper = new Helper(MiwgHelper.resourcePath('Reference'), 'bpmn-miwg-test-suite'),
      testBatchImport = helper.testBatchImport;


  function ensureValidBpmn20(err, results, done) {
    if (err) {
      return done(err);
    }

    helper.validateBasic(results);
    helper.validateBpmn20(results, done);
  }


  this.timeout(20000);

  it('should execute testsuite', testBatchImport('*.bpmn', ensureValidBpmn20));

});