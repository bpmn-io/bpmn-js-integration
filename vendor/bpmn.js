import CliSnapshotModule from '../lib/snapshot';
import BpmnJSCli from 'bpmn-js-cli';

import Modeler from 'bpmn-js/lib/Modeler';

Modeler.prototype._modules.push(BpmnJSCli);
Modeler.prototype._modules.push(CliSnapshotModule);

export default Modeler;