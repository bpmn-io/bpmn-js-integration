var Helper = require('../helper');

var describeSuite = Helper.describeSuite;


function validateDiagram(results, done) {
  try {
    this.validateBasic(results);
    return this.validateBpmn20(results, done);
  } catch (e) {
    return done(e);
  }
}

// With bpmn-js@9, we introduces planes for subporcesses. This increased import time in chrome by ~30%
// TODO(marstamm): investigate why the performance difference is significantly higher on phantomJS
// cf. https://github.com/bpmn-io/bpmn-js-integration/issues/17
describeSuite('base', __dirname + '/diagrams', validateDiagram, { timeout: 30000 });