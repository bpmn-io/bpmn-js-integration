var path = require('path');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);


  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      options: {
        reporter: 'spec',
        require: [
          './test/expect.js'
        ]
      },
      test: {
        src: [
          'test/spec/modeling/*.js',
          'test/spec/base/*.js',
          'test/spec/miwg/*.js'
        ]
      },
      miwg_postprocess: {
        src: [
          'test/postprocess/miwg-postprocess.js'
        ]
      },
      image_diff: {
        src: [
          'test/postprocess/image-diff.js'
        ]
      }
    },

    clean: [ 'tmp/integration', 'dist' ],

    browserify: {
      options: {
        transform: [
          [ 'babelify', {
            global: true
          } ]
        ],
        preBundleCB: function(b) {

          b.require('promise-polyfill');

          b.require(path.resolve('./vendor/bpmn.js'), {
            expose: 'bpmn-modeler'
          });
        }
      },
      modeler: {
        files: {
          'dist/bpmn.js': [ 'lib/bpmn.js' ],
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
                'http://bpmn.io/license - ' +
                'https://github.com/bpmn-io/bpmn-js */',
        sourceMap: true,
        sourceMapIncludeSources: true
      },
      modeler: {
        files: {
          'dist/bpmn.min.js': [ 'dist/bpmn.js' ]
        }
      }
    },

    watch: {
      test: {
        files: [ 'lib/**/*.js', 'test/spec/**/*.js' ],
        tasks: [ 'test' ]
      }
    }
  });

  // tasks

  grunt.registerTask('test', function(target) {

    if (target === 'image-diff') {

      try {
        require('node-resemble');
      } catch (e) {
        grunt.fail.warn(
          'it looks like you do not have node-resemble properly installed. Ensure you\n' +
          '\n' +
          '  (1) installed cairo on your machine' +
          '  (2) installed node-resemble (npm install node-resemble)');

      }

      return grunt.task.run([ 'mochaTest:image_diff' ]);
    }

    return grunt.task.run([ 'mochaTest:test', 'mochaTest:miwg_postprocess' ]);
  });

  grunt.registerTask('bundle', [ 'browserify:modeler', 'uglify:modeler' ]);

  grunt.registerTask('auto-test', [ 'test', 'watch:test' ]);

  grunt.registerTask('default', [ 'clean', 'bundle', 'test' ]);
};
