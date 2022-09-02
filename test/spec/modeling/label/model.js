/* embedded and executed in browser test */

async function executeTest(cli) {

  // elements
  cli.elements();

  // element
  var startEventElement = cli.element('StartEvent_1');

  var task = cli.create('bpmn:Task', '250,218', startEventElement.parent);

  var connection = cli.connect(startEventElement, task, 'bpmn:SequenceFlow');

  await cli.snapshot('modeled');

  cli.setLabel(connection, 'A connection label');
  cli.setLabel(startEventElement, 'A shape label');

  await cli.snapshot('setlabel');

  cli.removeConnection(connection);
  cli.removeShape(startEventElement);

  await cli.snapshot('removedlabel');

  cli.undo();
  cli.undo();

  await cli.snapshot('undone');

  cli.redo();
  cli.redo();

  await cli.snapshot('redone');
}
