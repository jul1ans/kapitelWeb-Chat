module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    frontend: {
      path:   'app/frontend',
      dist:   'app/frontend/dist',
      pub:    'app/frontend/public',
      test:   'app/frontend/test', 
    },
    backend: {
      path:   'app/backend',
      dist:   'app/backend/dist',
      test:   'app/backend/test'
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          '<%= frontend.pub %>/main.css': '<%= frontend.path %>/css/main.scss'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= frontend.pub %>/app.min.js': '<%= frontend.dist %>/main.js'
        }
      }
    },

    mocha: {
      backend: {
        src: '<%= backend.dist %>/test.js'
      },
      frontend: {
        src: '<%= frontend.dist %>/test.js'
      }
    },

    simplemocha:{
      backend:{
        src:"<%= backend.dist %>/test.js",
        options:{
          globals: ['window'],
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'tap'
        }
      },
      frontend:{
        src:"<%= frontend.test %>/test.js",
        options:{
          reporter: 'spec',
          slow: 200,
          timeout: 1000
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    watch: {
      frontendScript: {
        files: ['<%= frontend.path %>/js/**/*.js'],
        tasks: ['build:frontend:script', 'jshint', 'test', 'reload'],
        options: {
          livereload: true
        }
      },
      frontendTest: {
        files: ['<%= frontend.test %>/**/*.js'],
        tasks: ['build:frontend:script', 'jshint', 'test']
      },
      backendScript: {
        files: ['<%= backend.path %>/js/**/*.js', 'index.js'],
        tasks: ['build:backend', 'jshint', 'test'],
        options: {
          livereload: true
        }
      },
      backendTest: {
        files: ['<%= backend.test %>/**/*.js'],
        tasks: ['build:backend', 'jshint', 'test']
      },
      frontendStyle: {
        files: ['<%= frontend.path %>/css/main.scss'],
        tasks: ['build:frontend:style'],
        options: {
          livereload: true
        }
      },
      templates: {
        files: ['<%= frontend.path %>/**/*.html'],
        options: {
          livereload: true
        }
      }
    },

    babel: {
      options: {
        sourceMap: true
      },
      backend: {
        files: [{
          expand: true,
          cwd: '<%= backend.path %>',
          src: ['js/**/*.js'],
          dest: '<%= backend.dist %>',
          ext: '.js'
        },
        {
          expand: true,
          cwd: '<%= backend.test %>',
          src: ['**/*.js'],
          dest: '<%= backend.dist %>/test',
          ext: '.js'
        },
        {
          src: 'index.js',
          dest: 'app.js'
        }]
      },
      frontend: {
        files: [{
          expand: true,
          cwd: '<%= frontend.path %>',
          src: ['js/**/*.js'],
          dest: '<%= frontend.dist %>',
          ext: '.js'
        },
        {
          expand: true,
          cwd: '<%= frontend.test %>',
          src: ['**/*.js'],
          dest: '<%= frontend.dist %>/test',
          ext: '.js'
        }]
      }
    },

    mocha_istanbul: {
        coverage: {
            src: '<%= backend.dist %>/test', // a folder works nicely 
            options: {
                mask: '*.js'
            }
        }
    },

    istanbul_check_coverage: {
        default: {
            options: {
                coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results 
                check: {
                    lines: 80,
                    statements: 80
                }
            }
        }
    },

    copy: {
        dev: {
            files: [{
                src: 'build/<%= pkg.name %>.js',
                dest: 'public/js/<%= pkg.name %>.js'
            }, {
                src: 'build/<%= pkg.name %>.css',
                dest: 'public/css/<%= pkg.name %>.css'
            }]
        },
        prod: {
            files: [{
                src: ['client/img/*'],
                dest: 'dist/img/'
            }]
        }
    },

    nodemon: {
      dev: {
        script: 'app.js'
      }
    },

    open : {
      dev : {
        path: 'http://localhost:3000/'
      }
    },

    reload: {
        port: 6001,
        proxy: {
            host: 'localhost',
            port: 3000
        }
    },

    autoprefixer: {
      no_dest: {
        src: '<%= frontend.pub %>/main.css' // globbing is also possible here 
      }
    },

    browserify: {
      frontend: {
        src: ['<%= frontend.dist %>/js/**/*.js'],
        dest: '<%= frontend.dist %>/main.js'
      },
      backend: {
        src: ['<%= backend.dist %>/js/**/*.js'],
        dest: '<%= backend.dist %>/main.js'
      // },
      // frontendTest: {
      //   src: ['<%= frontend.dist %>/test/**/*.js'],
      //   dest: '<%= frontend.dist %>/test.js'
      // },
      // backendTest: {
      //   src: '<%= backend.dist %>/test/**/*.js',
      //   dest: '<%= backend.dist %>/test.js'
      }
    },

    concurrent: {
      dev: ['nodemon', 'open:dev', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

    docco: {
      options: {
        dst: './docs/annotated-source',
        layout: 'parallel'
      },
      docs: {
        files: [
          {
            src: '<%= frontend.path %>/js/**/*.js'
          },
          {
            src: 'index.js'
          }
        ]
      }
    },

    clean: {
      backend:  ['<%= backend.dist %>'],
      frontend: ['<%= frontend.dist %>']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false,
          clearRequireCache: false
        },
        src: ['<%= backend.dist %>/test.js']
      }
    },

    mochacli: {
      options: {
        reporter: "nyan",
        ui: "tdd"
      },
      all: ['<%= backend.dist %>/test/*.js']
    }
  });

  grunt.event.on('coverage', function(lcovFileContents, done){
      // Check below on the section "The coverage event" 
      done();
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-docco2');
  grunt.loadNpmTasks('grunt-simple-mocha');


  // MAIN TASKS
  grunt.registerTask('default', ['build', 'serve', 'watch']);
  grunt.registerTask('build', ['clean', 'babel', 'browserify', 'uglify', 'sass', 'autoprefixer']);
  grunt.registerTask('serve', ['concurrent:dev']);
  grunt.registerTask('test',  ['mocha_istanbul:coverage']);
  grunt.registerTask('doc',   ['docco']);

  // FRONTEND BUILD TASKS
  grunt.registerTask('build:frontend', ['build:frontend:script', 'build:frontend:style']);
  grunt.registerTask('build:frontend:script', [
    'clean:frontend', 'babel:frontend', 'browserify:frontend', 'uglify']);
  grunt.registerTask('build:frontend:style', ['sass', 'autoprefixer']);

  // BACKEND BUILD TASKS
  grunt.registerTask('build:backend', ['clean:backend', 'babel:backend', 'browserify:backend']);

  // grunt.registerTask('coveralls', ['mocha_istanbul:coveralls', 'istanbul_check_coverage']);
  //grunt.registerTask('coverage', ['mocha_istanbul:coverage', 'istanbul_check_coverage']);

};
