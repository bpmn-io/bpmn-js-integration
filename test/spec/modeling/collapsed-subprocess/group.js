/* @bpmn subprocess.bpmn */

async function executeTest(cli) {

  cli.setRoot('SubProcess_1_plane');

  await cli.snapshot('plane_switched');

  var planeElement = cli.element('SubProcess_1_plane');

  cli.create('bpmn:Group', '250,218', planeElement);

}