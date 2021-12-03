/* @bpmn initial.bpmn */
/* embedded and executed in browser test */

// test remove and undo
function executeTest(cli) {

  cli.remove([
    'SequenceFlow_19223ev',
    'ExclusiveGateway_076qmx0',
    'EndEvent_1unts79'
  ]);

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
