/* @bpmn complex.bpmn */
/* embedded and executed in browser test */

// test remove and undo
function executeTest(cli, editorActions) {

  editorActions.trigger('selectElements');
  editorActions.trigger('removeSelection');
  cli.snapshot('removed');

  editorActions.trigger('undo');
  cli.snapshot('undone');

  editorActions.trigger('redo');
  cli.snapshot('redone');
}
