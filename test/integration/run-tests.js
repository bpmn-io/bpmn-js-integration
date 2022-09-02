const { readFile, writeFile } = require('fs/promises');
const path = require('path');
const debug = require('debug')('test:integration:run-tests');

const PATTERN = /^snapshot ([^\s]+) ([^\s]+) (SUCCESS|FAIL)(?:\n*([^]+))?$/;

const FAIL = 'FAIL';

module.exports = runTests;

/**
 *
 * @param {import('puppeteer').Browser} browser
 * @param {*} configPath
 */
async function runTests(browser, configPath) {
  const tests = await parseTests(configPath);
  log('parsed config file ' + configPath);

  const page = await createPage();

  page.exposeFunction('report', function(message) {
    return report(message);
  });

  let idx = 0,
      test,
      results,
      snapshot,
      saveResultsAndNext = () => {};

  while (idx < tests.length) {
    results = {};
    snapshot = -1;
    test = tests[idx];

    await new Promise(resolve => {
      saveResultsAndNext = async function() {
        saveResults();
        log('done.');
        resolve();
      };

      executeTest(test);
    });

    idx++;
  }

  await writeFile(configPath, JSON.stringify(tests, null, 2));
  log('All done. Exiting.');


  function saveResults() {
    test.results = results;
  }

  async function report(msg) {
    const baseName = test.baseName;

    if (msg === 'done') {
      return saveResultsAndNext();
    }

    const match = PATTERN.exec(msg);
    if (!match) {
      throw new Error('unexpected message: ' + msg);
    }

    const name = match[1],
          element = match[2],
          status = match[3],
          payload = match[4];

    let step = snapshot + '-' + name,
        result = results[step];
    if (!result) {
      snapshot++;
      step = snapshot + '-' + name;
      result = results[step] = {};
    }

    if (status === FAIL) {
      log('test FAIL ' + step + ' ' + element + ': ' + payload);
      result[element] = { status: 'FAILED', error: payload };

      return;
    }

    log('test SUCCESS ' + step + ' ' + element);

    switch (element) {
    case 'reached':
      result[element] = { status: 'SUCCESS', file: baseName + '-' + step + '.png' };

      if (name !== 'page-open') {
        await screenshot(baseName + '-' + step + '.png');
      }

      break;

    case 'bpmn':
      result[element] = { status: 'SUCCESS', file: baseName + '-' + step + '.bpmn' };
      await writeFile(baseName + '-' + step + '.bpmn', payload);
      break;

    case 'svg':
      result[element] = { status: 'SUCCESS', file: baseName + '-' + step + '.svg' };
      await writeFile(baseName + '-' + step + '.svg', payload);
      break;

    default:
      log('unknown', msg);
    }
  }

  async function executeTest(test) {

    const fileName = path.resolve(process.cwd(), test.html);

    log('execute ' + test.name);

    const response = await page.goto('file://' + fileName);

    if (!response.ok()) {
      throw new Error('failed to load ' + fileName);
    }

    await report('snapshot page-open reached SUCCESS');
  }

  async function createPage() {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1024,
      height: 768
    });

    return page;
  }

  function screenshot(fileName) {
    return page.screenshot({ path: fileName });
  }
}

async function parseTests(configPath) {
  if (!configPath) {
    throw new Error('must specify test configuration file');
  }
  const testConfig = await readFile(configPath, 'utf-8');
  const tests = JSON.parse(testConfig);

  return tests;
}

function log(...args) {
  debug(...args);
}
