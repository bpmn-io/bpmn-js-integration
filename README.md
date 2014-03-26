# bpmn-js-integration-miwg

This project runs the [test diagrams](https://github.com/bpmn-miwg/bpmn-miwg-test-suite) provided by the [OMG BPMN MIWG](https://github.com/bpmn-miwg) against [bpmn-js](https://github.com/bpmn-io/bpmn-js).


## Setup

Clone the [test diagrams](https://github.com/bpmn-miwg/bpmn-miwg-test-suite) and [bpmn-js](https://github.com/bpmn-io/bpmn-js) next to this project in a local directory so that the folder structure is as follows:

```
.
..
bpmn-js
bpmn-js-integration-miwg
bpmn-miwg-test-suite
```

Install dependencies via npm.

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