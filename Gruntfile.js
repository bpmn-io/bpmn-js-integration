module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);


  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      sources: 'lib',
      tests: 'test',
      dist: 'dist'
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: [
            './test/expect.js'
          ]
        },
        src: [
          'test/spec/modeling/*.js',
          'test/spec/base/*.js',
          'test/spec/miwg/*.js'
        ]
      }
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
        tasks: [ 'mochaTest' ]
      }
    }
  });

  // tasks

  grunt.registerTask('test', [ 'mochaTest' ]);

  grunt.registerTask('bundle', [ 'browserify:modeler', 'uglify:modeler' ]);

  grunt.registerTask('auto-test', [ 'test', 'watch:test' ]);

  grunt.registerTask('default', [ 'bundle', 'test' ]);
};