module.exports = {
  __depends__: [ require('bpmn-js-cli') ],
  __init__: [ 'cliSnapshotInitializer' ],
  cliSnapshotInitializer: [ 'type', require('./initializer') ]
};