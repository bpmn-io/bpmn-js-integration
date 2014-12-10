module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);


  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      sources: 'lib',
      tests: 'test',
      dist: 'dist',
      temp: 'tmp'
    },

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
      miwg_rename: {
        src: [
          'test/postprocess/miwg-rename.js'
        ]
      },
      image_diff: {
        src: [
          'test/postprocess/image-diff.js'
        ]
      }
    },

    clean: {
      temp: [ '<%= config.temp %>', '<%= config.dist %>' ]
    },


    browserify: {
      options: {
        browserifyOptions: {
          builtins: false
        },
        bundleOptions: {
          detectGlobals: false,
          insertGlobalVars: [],
          debug: true
        }
      },

      modeler: {
        files: {
          '<%= config.dist %>/bpmn.js': [ '<%= config.sources %>/bpmn.js' ],
        },
        options: {
          alias: [
            '<%= config.sources %>/bpmn.js:bpmn-js/lib/Modeler'
          ]
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
          '<%= config.dist %>/bpmn.min.js': [ '<%= config.dist %>/bpmn.js' ]
        }
      }
    },

    watch: {
      test: {
        files: [ '<%= config.sources %>/**/*.js', '<%= config.tests %>/spec/**/*.js' ],
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

    return grunt.task.run([ 'mochaTest:test', 'mochaTest:miwg_rename' ]);
  });

  grunt.registerTask('bundle', [ 'browserify:modeler', 'uglify:modeler' ]);

  grunt.registerTask('auto-test', [ 'test', 'watch:test' ]);

  grunt.registerTask('default', [ 'clean', 'bundle', 'test' ]);
};