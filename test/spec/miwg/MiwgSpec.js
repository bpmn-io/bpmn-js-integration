'use strict';

var Helper = require('../Helper');


describe('bpmn-miwg', function() {

  var helper = new Helper('bpmn-miwg', '../bpmn-miwg-test-suite');


  it('should execute testsuite', function(done) {
    helper.runSuite('Reference/*.bpmn', done);
  }, 20000);

});