/* @bpmn containments.bpmn */

async function executeTest(cli) {
  cli.move('SubProcess_1', '20,40');

  await cli.snapshot('moved');

  cli.undo();

  await cli.snapshot('undone');

  cli.redo();

  await cli.snapshot('redone');
}