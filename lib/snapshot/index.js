module.exports = {
  __depends__: [ require('bpmn-js-cli').default ],
  __init__: [ 'cliSnapshotInitializer' ],
  cliSnapshotInitializer: [ 'type', require('./initializer') ]
};