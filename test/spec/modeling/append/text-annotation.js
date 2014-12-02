/* @bpmn containers.bpmn */

//Test events
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

  var e, i;

  for (i = 0; !!(e = elements[i]); i++) {
    cli.append(e, 'bpmn:TextAnnotation', '100,0');
  }
}