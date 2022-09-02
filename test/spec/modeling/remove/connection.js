/* @bpmn initial.bpmn */
/* embedded and executed in browser test */

// test remove connection
async function executeTest(cli) {

  cli.removeConnection('SequenceFlow_19223ev');

  await cli.snapshot('removed');

  cli.undo();

  await cli.snapshot('undone');

  cli.redo();

  await cli.snapshot('redone');
}
