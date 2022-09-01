/* @bpmn containers.bpmn */

// Test events
function executeTest(cli) {

  var elements = [
    'SubProcess_1',
    'Transaction_1',
    'Transaction_2',
    'IntermediateThrowEvent_1',
    'IntermediateThrowEvent_2',
    'IntermediateThrowEvent_3',
    'IntermediateCatchEvent_1',
    'IntermediateCatchEvent_2'
  ];

  for (var i = 0; i < elements.length; i++) {
    cli.append(elements[i], 'bpmn:TextAnnotation', '100,0');
  }
}