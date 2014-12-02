var glob = require('glob');


var BASE = 'tmp/integration';


describe('html summary', function() {


  it('should create html summary file', function() {
    var files = glob.sync('**/*.json', { cwd: BASE });

    console.log('json files', files.length);
  });

});