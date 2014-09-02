'use strict';


/**
 * Logs modeling snapshot results in a test-engine readable format.
 */
function SnapshotCommand(params, bpmnjs) {

  return {
    args: [ params.string('name') ],
    exec: function(name) {

      console.log('snapshot ' + name + ' reached SUCCESS');

      bpmnjs.saveSVG(function(err, svg) {
        console.log('snapshot ' + name + ' svg ' + (err ? 'FAIL' : 'SUCCESS') + '\n' + svg);
      });

      bpmnjs.saveXML(function(err, xml) {
        console.log('snapshot ' + name + ' bpmn ' + (err ? 'FAIL' : 'SUCCESS') + '\n' + xml);
      });
    }
  };
}

SnapshotCommand.$inject = [ 'cli._params', 'bpmnjs' ];

module.exports = SnapshotCommand;