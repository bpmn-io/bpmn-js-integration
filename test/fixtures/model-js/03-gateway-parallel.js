/* embedded and executed in browser test */

//Test parallel gateways
function executeTest(cli) {

  // element
  var startEventElement = cli.element('StartEvent_1');

  var gatewayShape1 = cli.append(startEventElement, 'bpmn:ParallelGateway', '100,0');

  var task = cli.append(gatewayShape1, 'bpmn:Task', '100,-100');
  var task2 = cli.append(gatewayShape1, 'bpmn:Task', '100,100');

  var gatewayShape2 = cli.append(task, 'bpmn:ParallelGateway', '100,100');

  cli.connect(task2, gatewayShape2, 'bpmn:SequenceFlow');

  cli.append(gatewayShape2, 'bpmn:EndEvent', '100,0');
}