import BpmnJSCli from 'bpmn-js-cli';

import SnapshotCommand from './commands/snapshot';

export default {
  __depends__: [ BpmnJSCli ],
  __init__: [ [ 'cli', function(cli) {

    // commands
    cli._registerCommand('snapshot', SnapshotCommand);
  } ] ]
};