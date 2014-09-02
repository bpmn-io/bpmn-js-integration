'use strict';

function Initializer(cli) {

  // commands
  cli._registerCommand('snapshot', require('./commands/snapshot'));
}

Initializer.$inject = [ 'cli' ];

module.exports = Initializer;
