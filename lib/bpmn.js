var Modeler = module.exports = require('../node_modules/bpmn-js/lib/Modeler');

var CliSnapshotModule = require('../lib/snapshot');

Modeler.prototype._modules.push(CliSnapshotModule);