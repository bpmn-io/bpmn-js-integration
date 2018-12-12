var CliSnapshotModule = require('../lib/snapshot'),
    BpmnJSCli = require('bpmn-js-cli').default;

var Modeler = require('bpmn-js/lib/Modeler').default;

module.exports = Modeler;

Modeler.prototype._modules.push(BpmnJSCli);
Modeler.prototype._modules.push(CliSnapshotModule);