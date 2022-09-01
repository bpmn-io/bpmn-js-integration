/* embedded and executed in browser test */

// test modeling of a simple process

function executeTest(cli) {
  var startEventElement = cli.element('StartEvent_1');

  cli.append(startEventElement, 'bpmn:Task 150,0');
}