# BPMN XSD Validation - How it works

This test suite creates processes on the fly using the [bpmn-js-cli](https://github.com/bpmn-io/bpmn-js-cli#readme).
It exports a xml and svg version of every process, stores it to a temp directory and start a validation of the exported XML.
For validation it uses the official BPMN schema definitions.


# Write test cases

Create a new test files in the [test directory](https://github.com/bpmn-io/bpmn-js-integration/tree/master/test/fixtures/model-js).
A test file is a valid JavaScript file, containing a function named `executeTest`

```javascript
function executeTest(cli) {
  var startEventElement = cli.element('StartEvent_1');
  var gatewayShape1 = cli.append('StartEvent_1', 'bpmn:ExclusiveGateway', '150,0');
  var task = cli.append(gatewayShape1, 'bpmn:Task', '250,0');
  var gatewayShape2 = cli.append(task, 'bpmn:ExclusiveGateway', '0,100');
  cli.connect(gatewayShape2, gatewayShape1, 'bpmn:SequenceFlow');
  cli.append(gatewayShape2, 'bpmn:EndEvent', '100,0');
}
```

The test output can be found at `tmp/integration/modeler-test/model-js/`.
