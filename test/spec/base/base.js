var Helper = require('../helper');


describe('base', function() {

  var helper = new Helper(__dirname + '/diagrams', 'base'),
      testBatchImport = helper.testBatchImport;


  this.timeout(40000);

  it('should execute testsuite', testBatchImport('*.bpmn'));

});