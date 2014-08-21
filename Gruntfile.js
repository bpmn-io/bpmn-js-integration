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

    jasmine_node: {
      options: {
        specNameMatcher: '.*Spec',
        jUnit: {
          report: true,
          savePath : 'tmp/reports/jasmine',
          useDotNotation: true,
          consolidate: true
        }
      },
      all: [ 'test/spec/' ]
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
          '<%= config.dist %>/bpmn.js': [ '<%= config.sources %>/**/*.js' ],
        },
        options: {
          alias: [
            'bpmn-js/lib/Modeler:bpmn-js/lib/Modeler'
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
          '<%= config.bowerDist %>/bpmn-viewer.min.js': [ '<%= config.bowerDist %>/bpmn-viewer.js' ]
        }
      }
    },

    watch: {
      jasmine_node: {
        files: [ '<%= config.sources %>/**/*.js', '<%= config.tests %>/spec/**/*.js' ],
        tasks: [ 'jasmine_node' ]
      }
    }
  });

  // tasks

  grunt.registerTask('test', [ 'jasmine_node' ]);

  grunt.registerTask('bundle', [ 'browserify:modeler', 'uglify:modeler' ]);

  grunt.registerTask('auto-test', [ 'jasmine_node', 'watch:jasmine_node' ]);

  grunt.registerTask('default', [ 'bundle', 'test' ]);
};