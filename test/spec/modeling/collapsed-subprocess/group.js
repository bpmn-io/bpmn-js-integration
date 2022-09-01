/* @bpmn subprocess.bpmn */

function executeTest(cli) {

  cli.setRoot('SubProcess_1_plane');

  cli.snapshot('plane_switched');

  var planeElement = cli.element('SubProcess_1_plane');

  cli.create('bpmn:Group', '250,218', planeElement);

}