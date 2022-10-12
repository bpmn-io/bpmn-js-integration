const Helper = require('../helper');

const MiwgHelper = require('../miwg-helper');

const describeSuite = Helper.describeSuite;


function validateDiagram(results, done) {
  try {
    this.validateBasic(results);
    return this.validateBpmn20(results, done);
  } catch (e) {
    return done(e);
  }
}


const miwgReferenceDirectory = MiwgHelper.resourcePath('Reference'),
      miwgSubmissionDirectory = MiwgHelper.submissionPath();


describeSuite(
  'bpmn-miwg-test-suite',
  miwgReferenceDirectory,
  validateDiagram,
  { timeout: 10000 }
);


describeSuite(
  'bpmn-miwg-test-suite',
  miwgSubmissionDirectory,
  validateDiagram,
  { glob: '*-export.bpmn', timeout: 10000 }
);
