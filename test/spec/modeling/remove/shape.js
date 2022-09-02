/* @bpmn initial.bpmn */
/* embedded and executed in browser test */

// test remove shape
async function executeTest(cli) {

  cli.removeShape('Task_0wqeeyb');

  await cli.snapshot('removed');

  cli.undo();

  await cli.snapshot('undone');

  cli.redo();

  await cli.snapshot('redone');
}
