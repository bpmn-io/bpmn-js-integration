/* @bpmn subprocess.bpmn */

async function executeTest(cli) {

  // new association
  var inputAssociation = cli.connect('DataObjectReference', 'Task_B', 'bpmn:DataInputAssociation');

  await cli.snapshot('created');

  // removed association
  cli.removeConnection(inputAssociation);

  await cli.snapshot('removed');

  cli.undo();
  cli.undo();

  await cli.snapshot('undone');

  cli.redo();
  cli.redo();

  await cli.snapshot('redone');
}