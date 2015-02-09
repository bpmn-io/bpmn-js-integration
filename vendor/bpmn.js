var Modeler = module.exports = require('../node_modules/bpmn-js/lib/Modeler');

var CliSnapshotModule = require('../lib/snapshot'),
    BpmnJSCli = require('bpmn-js-cli');

Modeler.prototype._modules.push(BpmnJSCli);
Modeler.prototype._modules.push(CliSnapshotModule);