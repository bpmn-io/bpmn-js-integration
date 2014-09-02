/* @bpmn initial.bpmn */
/* embedded and executed in browser test */

// test remove and undo
function executeTest(cli) {

  cli.removeConnection('SequenceFlow_19223ev');
  cli.removeShape('ExclusiveGateway_076qmx0');
  cli.removeShape('EndEvent_1unts79');

  cli.snapshot('removed');

  cli.undo();
  cli.undo();
  cli.undo();

  cli.snapshot('undone');

  cli.redo();
  cli.redo();
  cli.redo();

  cli.snapshot('redone');
}
