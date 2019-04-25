var glob = require('glob'),
    fs = require('fs'),
    path = require('path');


var BASE = 'tmp/integration/bpmn-miwg-test-suite';


describe('miwg rename', function() {

  it('should organize miwg test results according to import/export/roundtrip file pattern', function() {

    // rename import (svg|png) files
    var importFiles = glob.sync('**/*.+(svg|png)', { cwd: BASE });

    importFiles.forEach(function(f) {
      var base = path.basename(f),
          dirname = path.dirname(f);

      var newbase = importRename(base);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });


    // rename roundtrip (bpmn) files
    var roundtripFiles = glob.sync('*.bpmn', { cwd: BASE });

    roundtripFiles.forEach(function(f) {
      var base = path.basename(f),
          dirname = path.dirname(f);

      var newbase = roundtripRename(base);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });


    // patch path names in html / json files
    // to match renamed resources
    var outputFiles = glob.sync('**/*.+(html|json)', { cwd: BASE });

    outputFiles.forEach(function(f) {

      var filePath = path.join(BASE, f);

      var contents = fs.readFileSync(filePath, 'utf-8');

      var replaced = roundtripRename(importRename(contents));

      fs.writeFileSync(filePath, replaced);
    });

  });

});


function roundtripRename(str) {

  return str.replace(/-(\d)+-imported(-(\d)+)?\.bpmn/g, function(match, run, multi, diagramIndex) {
    if (multi) {
      return '.' + diagramIndex + '-roundtrip.bpmn';
    } else {
      return '-roundtrip.bpmn'
    };
  });
}

function importRename(str) {

  return str.replace(/-(\d)+-imported(-(\d)+)?\.(svg|png)/g, function(match, run, multi, diagramIndex, ext) {
    if (multi) {
      return '.' + diagramIndex + '-import.' + ext;
    } else {
      return '-import' + ext;
    };
  });
}