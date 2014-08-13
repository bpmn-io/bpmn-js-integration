//Test events
function runXSDValidation(cli) {

  // elements
  var elements = cli.elements();

  // element
  var startEventElement = cli.element('StartEvent_1');

  var ev1 = cli.append('StartEvent_1', 'bpmn:IntermediateThrowEvent', '100,0');
  cli.append(ev1, 'bpmn:IntermediateCatchEvent', '100,0');
}