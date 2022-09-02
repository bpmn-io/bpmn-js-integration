/* @bpmn containments.bpmn */

async function executeTest(cli) {

  cli.move([ 'StartEvent_3', 'SubProcess_2', 'ExclusiveGateway_1' ], '0,300', 'Process_1');

  await cli.snapshot('moved-outer');

  cli.move([ 'StartEvent_1', 'UserTask_1', 'EndEvent_1' ], '0,-300', 'SubProcess_1');

  await cli.snapshot('moved-inner');

  cli.move([ 'UserTask_1' ], '0,300', 'SubProcess_2');

  await cli.snapshot('moved-usertask');

  cli.undo();

  await cli.snapshot('undone-moved-usertask');

  cli.undo();

  await cli.snapshot('undone-movedinner');

  cli.undo();

  await cli.snapshot('undone-moved-outer');

  cli.redo();
  cli.redo();
  cli.redo();

  await cli.snapshot('redone');
}