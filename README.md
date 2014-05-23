# bpmn-js-integration-miwg

This project runs a number of test suites against [bpmn-js](https://github.com/bpmn-io/bpmn-js) to ensure that diagrams are correctly rendered.

Included suites:

*   basic models
*   [miwg diagrams](https://github.com/bpmn-miwg/bpmn-miwg-test-suite) provided by the [OMG BPMN MIWG](https://github.com/bpmn-miwg)


## Setup

Clone the [test diagrams](https://github.com/bpmn-miwg/bpmn-miwg-test-suite) and [bpmn-js](https://github.com/bpmn-io/bpmn-js) next to this project in a local directory so that the folder structure is as follows:

```
.
..
bpmn-js
bpmn-js-integration
bpmn-miwg-test-suite
```

Install dependencies via npm

```
npm install
```


## Execute Tests

```
grunt (auto-test||test)
```

This will generate the test results to `tmp/integration/miwg`.


## License

MIT