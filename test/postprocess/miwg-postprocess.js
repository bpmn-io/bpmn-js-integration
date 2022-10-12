const glob = require('glob'),
      fs = require('fs'),
      path = require('path');


const BASE = 'tmp/integration/bpmn-miwg-test-suite';


describe('miwg postprocess', function() {

  it('should remove excessive roundtrip files', function() {

    const roundtripFiles = glob.sync('*.bpmn', { cwd: BASE });

    roundtripFiles.forEach(function(f) {
      if (/-\d+-imported-[2-9]\.bpmn$/g.test(f)) {
        fs.unlinkSync(path.join(BASE, f));
      }
    });
  });


  it('should organize miwg import test results according to export/import/roundtrip file pattern', function() {

    // rename export (bpmn|svg|png) files
    const exportFiles = glob.sync('*-export-+([0-9])-imported.@(bpmn|png|svg)', { cwd: BASE });

    exportFiles.forEach(function(f) {
      const base = path.basename(f),
            dirname = path.dirname(f);

      const newbase = exportRename(base);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });


    // rename import (svg|png) files
    const importFiles = glob.sync('**/*.+(svg|png)', { cwd: BASE });

    importFiles.forEach(function(f) {
      const base = path.basename(f),
            dirname = path.dirname(f);

      const newbase = importRename(base);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });


    // rename roundtrip (bpmn) files
    const roundtripFiles = glob.sync('*.bpmn', { cwd: BASE });

    roundtripFiles.forEach(function(f) {
      const base = path.basename(f),
            dirname = path.dirname(f);

      const newbase = roundtripRename(base);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });


    // patch path names in html / json files
    // to match renamed resources
    const outputFiles = glob.sync('**/*.+(html|json)', { cwd: BASE });

    outputFiles.forEach(function(f) {

      const filePath = path.join(BASE, f);

      const contents = fs.readFileSync(filePath, 'utf-8');

      const replaced = roundtripRename(importRename(exportRename(contents)));

      fs.writeFileSync(filePath, replaced);
    });

  });

});

function exportRename(str) {
  return str.replace(/-export-(\d+)-imported/g, '-export');
}

function roundtripRename(str) {

  return str.replace(/-(\d)+-imported(-(\d)+)?\.bpmn/g, function(match, run, multi, diagramIndex) {
    return '-roundtrip.bpmn';
  });
}

function importRename(str) {

  return str.replace(/-(\d)+-imported(-(\d)+)?\.(svg|png)/g, function(match, run, multi, diagramIndex, ext) {
    if (multi) {
      return '-import.' + diagramIndex + '.' + ext;
    } else {
      return '-import.' + ext;
    }
  });
}
