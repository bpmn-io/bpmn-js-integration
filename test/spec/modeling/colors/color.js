/* @bpmn colors.bpmn */

async function executeTest(cli) {

  await cli.snapshot('imported');

  var elements = cli.elements();

  // TODO(@barmac): remove this once bpmn-js#1734 is fixed (https://github.com/bpmn-io/bpmn-js/issues/1734)
  elements = elements.filter(function(element) {
    return !/Process|Collaboration/i.test(element);
  });

  // reset colors
  cli.color(elements, 'unset,unset');

  await cli.snapshot('reset');

  // color all
  cli.color(elements, 'red,green');
}