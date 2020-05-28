'use strict';


/**
 * Logs modeling snapshot results in a test-engine readable format.
 */
function SnapshotCommand(params, bpmnjs) {

  return {
    args: [ params.string('name') ],
    exec: function(name) {

      console.log('snapshot ' + name + ' reached SUCCESS');

      bpmnjs.saveSVG().then(function(result){

        console.log('snapshot ' + name + ' svg SUCCESS ' + '\n' + result.svg);

      }).catch(function(err) {

        console.log('snapshot ' + name + ' svg FAIL\n');
        console.log(err.message);
      });

      bpmnjs.saveXML({ format: true }).then(function(result) {

        console.log('snapshot ' + name + ' bpmn SUCCESS\n' + result.xml);
      }).catch(function(err) {

        console.log('snapshot ' + name + ' bpmn FAIL\n');
        console.log(err.message);
      });
    }
  };
}

SnapshotCommand.$inject = [ 'cli._params', 'bpmnjs' ];

module.exports = SnapshotCommand;
