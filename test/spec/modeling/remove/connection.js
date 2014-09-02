/* @bpmn initial.bpmn */
/* embedded and executed in browser test */

// test remove connection
function executeTest(cli) {

  cli.removeConnection('SequenceFlow_19223ev');

  cli.snapshot('removed');

  cli.undo();

  cli.snapshot('undone');

  cli.redo();

  cli.snapshot('redone');
}
