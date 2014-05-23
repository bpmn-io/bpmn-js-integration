var phantomjs = require('phantomjs'),
    spawn = require('child_process').spawn;

function log(err, message) {
  console.log('  ' + (err ? 'ERR! ' : '') + message.toString('utf-8').replace(/\n\s*$/, ''));
}

function run(script, args, done) {

  var runArgs = args.slice();

  runArgs.unshift(script);

  var instance = spawn(phantomjs.path, runArgs, {
    cwd: process.cwd()
  });

  instance.stdout.on('data', function (data) {
    log(null, data);
  });

  instance.stderr.on('data', function (data) {
    log(true, data);
  });

  instance.on('close', function (code) {
    done(!code ? null : new Error('browser exited with code ' + code));
  });

  return instance;
}

module.exports = run;