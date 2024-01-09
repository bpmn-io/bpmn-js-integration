'use strict';

/* eslint-env browser */

/**
 * Logs modeling snapshot results in a test-engine readable format.
 */
function SnapshotCommand(params, bpmnjs) {

  return {
    args: [ params.string('name') ],
    exec: function(name) {

      var saveSVG = bpmnjs.saveSVG().then(function(result) {
        return window.report('snapshot ' + name + ' svg SUCCESS ' + '\n' + result.svg);
      }).catch(function(err) {
        return window.report('snapshot ' + name + ' svg FAIL\n' + err.message);
      });

      var saveXML = bpmnjs.saveXML({ format: true }).then(function(result) {

        return window.report('snapshot ' + name + ' bpmn SUCCESS\n' + result.xml);
      }).catch(function(err) {
        return window.report('snapshot ' + name + ' bpmn FAIL\n' + err.message);
      });

      return Promise.all([
        window.report('snapshot ' + name + ' reached SUCCESS'),
        saveSVG,
        saveXML
      ]);
    }
  };
}

SnapshotCommand.$inject = [ 'cli._params', 'bpmnjs' ];

module.exports = SnapshotCommand;
