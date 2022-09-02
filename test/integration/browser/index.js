const puppeteer = require('puppeteer');

function _log(err, message) {
  console.log('  ' + (err ? 'ERR! ' : '') + message.toString('utf-8').replace(/\n\s*$/, ''));
}

async function run(script, args, done) {

  const browser = await puppeteer.launch();

  let error;
  try {
    const execute = require(script);

    await execute(browser, ...args);
  } catch (e) {
    console.error(e);
    error = e;
  } finally {
    await browser.close();
  }

  done(error);
}

module.exports.run = run;