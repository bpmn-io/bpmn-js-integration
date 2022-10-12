const puppeteer = require('puppeteer');

function _log(err, message) {
  console.log('  ' + (err ? 'ERR! ' : '') + message.toString('utf-8').replace(/\n\s*$/, ''));
}

let browser;

before(async function openBrowser() {
  browser = await puppeteer.launch();
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