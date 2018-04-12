var Helper = require('../helper');

var describeSuite = Helper.describeSuite;


function validateBasic(results, done) {
  try {
    this.validateBasic(results);
    return this.validateBpmn20(results, done);
  } catch (e) {
    return done(e);
  }
}


describeSuite('base', __dirname + '/diagrams', validateBasic, { timeout: 4000 });