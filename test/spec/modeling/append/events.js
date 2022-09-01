/* embedded and executed in browser test */

// Test events
function executeTest(cli) {

  var startEventElement = cli.element('StartEvent_1');

  var intermediateThrowEvent = cli.append(startEventElement, 'bpmn:IntermediateThrowEvent', '100,0');
  cli.append(intermediateThrowEvent, 'bpmn:IntermediateCatchEvent', '100,0');
}