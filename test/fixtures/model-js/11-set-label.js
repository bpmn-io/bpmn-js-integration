/* embedded and executed in browser test */

// Test append a label 
function executeTest(cli) {

  // elements
  var elements = cli.elements();

  // element
  var startEventElement = cli.element('StartEvent_1');

  var task = cli.create('bpmn:Task', '250,218', startEventElement.parent);

  var connection = cli.connect(startEventElement, task, 'bpmn:SequenceFlow');

  cli.setLabel(connection, 'A connection label');
  cli.setLabel(startEventElement, 'A shape label');
}
