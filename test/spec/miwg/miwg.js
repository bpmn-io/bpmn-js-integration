
const glob = require('glob'),
      fs = require('fs'),
      path = require('path');

const Helper = require('../helper');

const MiwgHelper = require('../miwg-helper');

const miwgReferenceDirectory = MiwgHelper.resourcePath('Reference'),
      miwgSubmissionDirectory = MiwgHelper.submissionPath();


after(postprocess);


Helper.describeSuite(
  'bpmn-miwg-test-suite',
  miwgReferenceDirectory,
  validateDiagram,
  { timeout: 10000 }
);


Helper.describeSuite(
  'bpmn-miwg-test-suite',
  miwgSubmissionDirectory,
  validateDiagram,
  { glob: '*-export.bpmn', timeout: 10000 }
);


function validateDiagram(results, done) {
  try {
    this.validateBasic(results);
    return this.validateBpmn20(results, done);
  } catch (e) {
    return done(e);
  }
}

function postprocess() {

  const BASE = 'tmp/integration/bpmn-miwg-test-suite';

  removeExcessiveRoundtripFiles();
  renameExports();
  renameImports();
  renameRoundtrips();
  patchOutputFiles();

  function removeExcessiveRoundtripFiles() {
    const roundtripFiles = glob.sync('*.bpmn', { cwd: BASE });

    roundtripFiles.forEach(function(f) {
      if (/-\d+-imported-[2-9]\.bpmn$/g.test(f)) {
        fs.unlinkSync(path.join(BASE, f));
      }
    });
  }

  function renameExports() {

    // rename export (bpmn|svg|png) files
    const exportFiles = glob.sync('*-export-+([0-9])-imported.@(bpmn|png|svg)', { cwd: BASE });

    exportFiles.forEach(function(f) {
      const base = path.basename(f),
            dirname = path.dirname(f);

      const newbase = exportRename(base);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });
  }

  function renameImports() {

    // rename import (svg|png) files
    const importFiles = glob.sync('**/*.+(svg|png)', { cwd: BASE });

    importFiles.forEach(function(f) {
      const base = path.basename(f),
            dirname = path.dirname(f);

      const newbase = importRename(base);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });
  }

  function renameRoundtrips() {

    // rename roundtrip (bpmn) files
    const roundtripFiles = glob.sync('*.bpmn', { cwd: BASE });

    roundtripFiles.forEach(function(f) {
      const base = path.basename(f),
            dirname = path.dirname(f);

      const newbase = roundtripRename(base);

      fs.renameSync(path.join(BASE, f), path.join(BASE, dirname, newbase));
    });
  }

  function patchOutputFiles() {

    // patch path names in html / json files
    // to match renamed resources
    const outputFiles = glob.sync('**/*.+(html|json)', { cwd: BASE });

    outputFiles.forEach(function(f) {

      const filePath = path.join(BASE, f);

      const contents = fs.readFileSync(filePath, 'utf-8');

      const replaced = roundtripRename(importRename(exportRename(contents)));

      fs.writeFileSync(filePath, replaced);
    });
  }

  function exportRename(str) {
    return str.replace(/-export-(\d+)-imported/g, '-export');
  }

  function roundtripRename(str) {

    return str.replace(/-(\d)+-imported(-(\d)+)?\.bpmn/g, () => '-roundtrip.bpmn');
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
}
