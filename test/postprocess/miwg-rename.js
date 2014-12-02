var glob = require('glob'),
    fs = require('fs'),
    path = require('path');


var BASE = 'tmp/integration/bpmn-miwg-test-suite';


describe('miwg rename', function() {

  it('should organize miwg test results according to import/export/roundtrip file pattern', function() {

    // rename import (svg|png) files
    var importFiles = glob.sync('**/*-1-imported.+(svg|png)', { cwd: BASE });

    importFiles.forEach(function(f) {
      var ext = path.extname(f),
          base = path.basename(f),
          dirname = path.dirname(f);

      var newbase = base.replace('-1-imported' + ext, '-import' + ext);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });


    // rename roundtrip (bpmn) files
    var roundtripFiles = glob.sync('**/*-1-imported.bpmn', { cwd: BASE });

    roundtripFiles.forEach(function(f) {
      var ext = path.extname(f),
          base = path.basename(f),
          dirname = path.dirname(f);

      var newbase = base.replace('-1-imported' + ext, '-roundtrip' + ext);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });


    // patch html / json files
    var outputFiles = glob.sync('**/*.+(html|json)', { cwd: BASE });

    outputFiles.forEach(function(f) {

      var filePath = path.join(BASE, f);

      var contents = fs.readFileSync(filePath, 'utf-8');

      var replaced = contents
            .replace(/-1-imported.(svg|png)/g, '-import.$1')
            .replace(/-1-imported.bpmn/g, '-roundtrip.bpmn');

      fs.writeFileSync(filePath, replaced);
    });

  });

});