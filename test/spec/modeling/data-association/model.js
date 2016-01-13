/* @bpmn base.bpmn */

function executeTest(cli) {

  // new association
  var inputAssociation = cli.connect('DataObjectReference', 'Task_B', 'bpmn:DataInputAssociation');

  cli.snapshot('created');

  // removed association
  cli.removeConnection('DataInputAssociation');

  cli.snapshot('removed');

  cli.undo();
  cli.undo();

  cli.snapshot('undone');

  cli.redo();
  cli.redo();

  cli.snapshot('redone');
}