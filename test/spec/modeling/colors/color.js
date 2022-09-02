/* @bpmn colors.bpmn */

async function executeTest(cli) {

  await cli.snapshot('imported');

  var elements = cli.elements();

  // reset colors
  cli.color(elements, 'unset,unset');

  await cli.snapshot('reset');

  // color all
  cli.color(elements, 'red,green');
}