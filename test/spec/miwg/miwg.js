var Helper = require('../helper');


describe('bpmn-miwg-test-suite', function() {

  var helper = new Helper('../bpmn-miwg-test-suite/Reference', 'bpmn-miwg-test-suite'),
      testBatchImport = helper.testBatchImport;


  this.timeout(20000);

  it('should execute testsuite', testBatchImport('*.bpmn'));

});