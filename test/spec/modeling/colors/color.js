/* @bpmn colors.bpmn */

function executeTest(cli) {

  cli.snapshot('imported');

  var elements = cli.elements();

  // reset colors
  cli.color(elements, 'unset,unset');

  cli.snapshot('reset');

  // color all
  cli.color(elements, 'red,green');
}