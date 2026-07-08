const puppeteer = require('puppeteer-core');
const which = require('which');

// eslint-disable-next-line no-unused-vars
function _log(err, message) {
  console.log('  ' + (err ? 'ERR! ' : '') + message.toString('utf-8').replace(/\n\s*$/, ''));
}

async function findChrome() {

  if (process.env.CHROME_BIN) {
    return process.env.CHROME_BIN;
  }

  const names = [ 'google-chrome', 'chrome', 'chromium' ];

  for (const name of names) {
    try {
      return await which(name);
    } catch {
      continue;
    }
  }

  throw new Error('chrome not found via: ' + names.join(', '));
}

let browser;

before(async function openBrowser() {
  this.timeout(10000);

  const executablePath = await findChrome();

  browser = await puppeteer.launch({
    headless: 'new',
    executablePath
  });
});


after(async function closeBrowser() {
  if (browser) {
    await browser.close();
  }
});


async function run(script, args, done) {

  let error;
  try {
    const execute = require(script);

    await execute(browser, ...args);
  } catch (e) {
    console.error(e);
    error = e;
  }

  done(error);
}

module.exports.run = run;