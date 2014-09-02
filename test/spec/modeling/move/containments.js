/* @bpmn containments.bpmn */

function executeTest(cli) {
  cli.move('SubProcess_1', '20,40');

  cli.snapshot('moved');

  cli.undo();

  cli.snapshot('undone');

  cli.redo();

  cli.snapshot('redone');
}