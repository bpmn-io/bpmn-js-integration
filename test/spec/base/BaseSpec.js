'use strict';

var _ = require('lodash');

var Helper = require('../Helper');


describe('bpmn-miwg', function() {

  var helper = new Helper('base', 'test/fixtures');


  it('should execute base tests', function(done) {
    helper.runSuite('bpmn/*.bpmn', function(err, results) {

      console.log('[IMPORT] [EXPORT_SVG] [EXPORT_BPMN] file');

      function status(r) {
        if (r === 'SUCCESS') {
          return r;
        } else {
          return 'FAIL';
        }
      }

      _.forEach(results, function(r) {
        console.log(
          '[%s] [%s] [%s] %s',
          status(r.results['import-bpmn']),
          status(r.results['export-svg']),
          status(r.results['export-bpmn']),
          r.file
        );
      });

      done(err);
    });
  }, 50000);

});