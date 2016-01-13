var glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    resemble = require('node-resemble'),
    mkdirp = require('mkdirp'),
    async = require('async');

var MiwgHelper = require('../miwg-helper');


mkdirp.sync('tmp/integration-diff');

describe('image diff', function() {

  var dirA = MiwgHelper.resourcePath('bpmn.io 0.1.3'),
      dirB = 'tmp/integration/bpmn-miwg-test-suite';


  it('should compare images', function(done) {

    var images = glob.sync('*.png', { cwd: dirA });


    var comparisons = [];

    images.forEach(function(img) {

      comparisons.push(function(done) {

        var imageA = fs.readFileSync(path.join(dirA, img)),
            imageB = fs.readFileSync(path.join(dirB, img));

        resemble.outputSettings({
          errorColor: {
            red: 255,
            green: 0,
            blue: 255
          },
          errorType: 'movement',
          transparency: 0.3
        });

        resemble(imageA).compareTo(imageB).ignoreAntialiasing().onComplete(function(data){
          var comparisonImageData = data.getImageDataUrl().substring('data:image/png;base64,'.length);

          var comparisonImage = new Buffer(comparisonImageData, 'base64');

          fs.writeFileSync(path.join('tmp/integration-diff', img), comparisonImage);

          done();
        });

      });

    });

    async.series(comparisons, done);
  });

});