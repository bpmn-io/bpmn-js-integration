/* @bpmn subprocess.bpmn */

async function executeTest(cli) {

  cli.setRoot('SubProcess_1_plane');

  await cli.snapshot('plane_switched');

  cli.append('StartEvent_2', 'bpmn:Task');

}