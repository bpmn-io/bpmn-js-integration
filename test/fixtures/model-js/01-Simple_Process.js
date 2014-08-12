function runXSDValidation(cli) {

  // elements
  var elements = cli.elements();

  // element
  var startEventElement = cli.element('StartEvent_1');

  var task = cli.append(startEventElement, 'bpmn:Task 150,0');
}