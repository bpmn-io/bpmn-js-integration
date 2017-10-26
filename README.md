# bpmn-js-integration

[![Build Status](https://travis-ci.org/bpmn-io/bpmn-js-integration.svg?branch=master)](https://travis-ci.org/bpmn-io/bpmn-js-integration)

This project runs a number of test suites against [bpmn-js](https://github.com/bpmn-io/bpmn-js) to ensure that diagrams are correctly rendered.

Included suites:

*   basic models
*   [miwg diagrams](https://github.com/bpmn-miwg/bpmn-miwg-test-suite) provided by the [BPMN Model Interchange Working Group](https://github.com/bpmn-miwg)


## Setup

Install dependencies via npm

```
npm install
```

Optionally link snapshot versions of other libraries into the project:

```
npm link ../bpmn-js
```


## Execute Tests

```
npm run all
```

This will generate the test results to `tmp/integration`.


## License

MIT
