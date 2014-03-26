var phantomjs = require('phantomjs'),
    spawn = require('child_process').spawn;


function run(script, args, done) {

  var runArgs = args.slice();

  runArgs.unshift(script);

  var instance = spawn(phantomjs.path, runArgs, {
    cwd: process.cwd()
  });

  instance.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  instance.stderr.on('data', function (data) {
    console.error('stderr: ' + data);
  });

  instance.on('close', function (code) {
    done(!code ? null : new Error('browser exited with code ' + code));
  });

  return instance;
}

module.exports = run;