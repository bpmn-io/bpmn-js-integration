const { readFileSync: read, writeFileSync: write } = require('fs');

const { resourcePath } = require('../test/spec/miwg-helper');

const toolsListLocation = resourcePath('tools-tested-by-miwg.json');

const toolsList = JSON.parse(read(toolsListLocation, 'utf-8'));

const entry = toolsList.tools.find(entry => entry.tool === 'bpmn.io (Camunda Modeler)');

entry.version = process.env.TOOLKIT_VERSION;

const currentYear = `${new Date().getFullYear()}`;

entry.lastResultsSubmitted = currentYear;

if (process.env.UPDATE_DEMO_YEAR === 'true') {
  const demosList = entry.participatedInDemosByYear.split(',');

  if (!demosList.includes(currentYear)) {
    demosList.unshift(currentYear);
  }

  entry.participatedInDemosByYear = demosList.join(',');
}


write(toolsListLocation, JSON.stringify(toolsList, null, 2), 'utf-8');
