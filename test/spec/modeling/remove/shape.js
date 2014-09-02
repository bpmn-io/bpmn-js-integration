/* @bpmn initial.bpmn */
/* embedded and executed in browser test */

// test remove shape
function executeTest(cli) {

  cli.removeShape('Task_0wqeeyb');

  cli.snapshot('removed');

  cli.undo();

  cli.snapshot('undone');

  cli.redo();

  cli.snapshot('redone');
}
