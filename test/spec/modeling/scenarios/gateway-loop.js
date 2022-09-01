/* embedded and executed in browser test */

// Test gateways and joining on gateway for a loop
function executeTest(cli) {

  var i;

  // element
  cli.element('StartEvent_1');

  var gatewayShape1 = cli.append('StartEvent_1', 'bpmn:ExclusiveGateway', '150,0');

  var task = cli.append(gatewayShape1, 'bpmn:Task', '250,0');

  var gatewayShape2 = cli.append(task, 'bpmn:ExclusiveGateway', '0,100');

  cli.connect(gatewayShape2, gatewayShape1, 'bpmn:SequenceFlow');

  cli.append(gatewayShape2, 'bpmn:EndEvent', '100,0');


  cli.snapshot('modeled');

  for (i = 0; i < 5; i++) {
    cli.undo();
  }

  cli.snapshot('undone');

  for (i = 0; i < 5; i++) {
    cli.redo();
  }

  cli.snapshot('redone');
}