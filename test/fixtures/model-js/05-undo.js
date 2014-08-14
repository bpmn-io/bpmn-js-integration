//Test undo
function runXSDValidation(cli) {

  // elements
  var elements = cli.elements();

  // element
  var startEventElement = cli.element('StartEvent_1');

  var gatewayShape1 = cli.append('StartEvent_1', 'bpmn:ExclusiveGateway', '150,0');

  var task = cli.append(gatewayShape1, 'bpmn:Task', '250,0');

  var gatewayShape2 = cli.append(task, 'bpmn:ExclusiveGateway', '0,100');

  cli.connect(gatewayShape2, gatewayShape1, 'bpmn:SequenceFlow');

  cli.append(gatewayShape2, 'bpmn:EndEvent', '100,0');

  var i = 5;

  // Undo All
  while (i) {
    cli.undo();
    i--;
  };
}