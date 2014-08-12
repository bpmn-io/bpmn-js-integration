'use strict';

var SchemaValidator = require('xsd-schema-validator'),
                 fs = require('fs');

var BPMN_XSD = '../bpmn-moddle/resources/bpmn/xsd/BPMN20.xsd';



function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

module.exports.fromFile = function(moddle, file, done) {
  var fileContents = readFile(file);
  moddle.fromXML(fileContents, 'bpmn:Definitions', done);
};

module.exports.toXML = function(element, opts, done) {
  element.$model.toXML(element, opts, done);
};

module.exports.validate = function(xml, done, reporterCallback) {

  if (!xml) {
    return done(new Error('XML is not defined'));
  }

  SchemaValidator.validateXML(xml, BPMN_XSD, function(err, result) {

    if (err) {
      return done(err);
    }
    expect(result.valid).toEqual(true);
    reporterCallback(result.valid === true ? 'SUCCESS' : 'FAIL');
    done();
  });
};