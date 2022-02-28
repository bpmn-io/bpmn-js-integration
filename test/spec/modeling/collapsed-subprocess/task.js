/* @bpmn subprocess.bpmn */

function executeTest(cli) {

  cli.setRoot('SubProcess_1_plane');

  cli.snapshot('plane_switched');

  cli.append('StartEvent_2', 'bpmn:Task');

}