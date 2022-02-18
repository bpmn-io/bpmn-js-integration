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

// creating subprocess planes for complex diagram takes a while
describeSuite('base', __dirname + '/diagrams', validateDiagram, { timeout: 25000 });