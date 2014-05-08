'use strict';

var Helper = require('../Helper');


describe('bpmn-miwg', function() {

  var helper = new Helper('bpmn-miwg', '../bpmn-miwg-test-suite');


  it('should execute A testsuite', function(done) {
    helper.runSuite('A - Fixed Digrams with Variations of Attributes/Reference/*.bpmn', done);
  }, 20000);


  it('should execute B testsuite', function(done) {
    helper.runSuite('B - Validate that tool covers conformance class set/Reference/*.bpmn', done);
  }, 20000);

});