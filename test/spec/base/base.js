var Helper = require('../helper');

var describeSuite = Helper.describeSuite;


function validateBasic(results, done) {
  try {
    this.validateBasic(results);
  } catch (e) {
    return done(e);
  }

  return done(null, results);
}


describeSuite('base', __dirname + '/diagrams', validateBasic);