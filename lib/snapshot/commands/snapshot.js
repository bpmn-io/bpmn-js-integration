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

        if (err) {
          console.log(err.message);
        }
      });

      bpmnjs.saveXML({ format: true }, function(err, xml) {
        console.log('snapshot ' + name + ' bpmn ' + (err ? 'FAIL' : 'SUCCESS') + '\n' + xml);

        if (err) {
          console.log(err.message);
        }
      });
    }
  };
}

SnapshotCommand.$inject = [ 'cli._params', 'bpmnjs' ];

module.exports = SnapshotCommand;