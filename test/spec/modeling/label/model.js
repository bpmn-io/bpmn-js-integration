/* embedded and executed in browser test */

function executeTest(cli) {

  // elements
  var elements = cli.elements();

  // element
  var startEventElement = cli.element('StartEvent_1');

  var task = cli.create('bpmn:Task', '250,218', startEventElement.parent);

  var connection = cli.connect(startEventElement, task, 'bpmn:SequenceFlow');

  cli.snapshot('modeled');

  cli.setLabel(connection, 'A connection label');
  cli.setLabel(startEventElement, 'A shape label');

  cli.snapshot('setlabel');

  cli.removeConnection(connection);
  cli.removeShape(startEventElement);

  cli.snapshot('removedlabel');

  cli.undo();
  cli.undo();

  cli.snapshot('undone');

  cli.redo();
  cli.redo();

  cli.snapshot('redone');
}
