# bpmn-js-integration

[![Build Status](https://travis-ci.org/bpmn-io/bpmn-js-integration.svg?branch=master)](https://travis-ci.org/bpmn-io/bpmn-js-integration)

This project runs a number of integration tests against [bpmn-js](https://github.com/bpmn-io/bpmn-js):

* basic modeling scenarios
* various diagram import / export tests
* import / export tests for [MIWG diagrams](https://github.com/bpmn-miwg/bpmn-miwg-test-suite) provided by the [BPMN Model Interchange Working Group](https://github.com/bpmn-miwg)


## Setup

> :warning: You must have NodeJS, and a Java JDK installed for the following steps to work.

Install dependencies:

```
npm install
```

Optionally link snapshot versions of other libraries into the project:

```
npm link ../bpmn-js
```

Optionally clone [MIWG test suite](https://github.com/bpmn-miwg/bpmn-miwg-test-suite) into sibling folder:

```
(cd .. && git clone git@github.com:bpmn-miwg/bpmn-miwg-test-suite.git)
```


## Execute Tests

Run all tests and generate the results to `tmp/integration` by executing:

```
npm run all
```



## Generate MIWG Suite Results

```sh
git clone git@github.com:bpmn-io/bpmn-js-integration.git
git clone git@github.com:bpmn-miwg/bpmn-miwg-test-suite.git

cd bpmn-js-integration
npm install
npm run all

cd tmp/integration/bpmn-miwg-test-suite
ls -lla
```


## License

MIT
