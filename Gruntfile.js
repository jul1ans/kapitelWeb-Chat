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
          '<%= frontend.pub %>/main.css': 'app/css/main.scss'
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
      test: {
        src: ['test/**/*.js']
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
      frontend: {
        files: ['<%= frontend.test %>/test/**/*.js'],
        tasks: ['jshint'/*, 'mocha'*/, 'reload']
      },
      backend: {
        files: ['<%= backend.test %>/test/**/*.js'],
        tasks: ['jshint'/*, 'mocha'*/]
      }
    },

    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= frontend.path %>',
          src: ['js/**/*.js'],
          dest: '<%= frontend.dist %>',
          ext: '.js'
        },
        {
          expand: true,
          cwd: '<%= backend.path %>',
          src: ['js/**/*.js'],
          dest: '<%= backend.dist %>',
          ext: '.js'
        }]
      }
    },

    mocha_istanbul: {
        coverage: {
            src: 'test', // a folder works nicely 
            options: {
                mask: '*.spec.js'
            }
        },
        coverageSpecial: {
            src: ['testSpecial/*/*.js', 'testUnique/*/*.js'], // specifying file patterns works as well 
            options: {
                coverageFolder: 'coverageSpecial',
                mask: '*.spec.js',
                mochaOptions: ['--harmony','--async-only'], // any extra options 
                istanbulOptions: ['--harmony','--handle-sigint']
            }
        },
        coveralls: {
            src: ['test', 'testSpecial', 'testUnique'], // multiple folders also works 
            options: {
                coverage:true, // this will make the grunt.event.on('coverage') event listener to be triggered 
                check: {
                    lines: 75,
                    statements: 75
                },
                root: './lib', // define where the cover task should consider the root of libraries that are covered by tests 
                reportFormats: ['cobertura','lcovonly']
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
        script: 'index.js'
      }
    },

    open : {
      dev : {
        path: 'http://localhost:3000/',
        app: 'google-chrome'
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
      }
    },

    concurrent: {
      dev: ['nodemon', 'open:dev', 'watch']
    },

    docco: {
      options: {
        dst: './docs/annotated-source',
        layout: 'parallel'
      },
      docs: {
        files: [
          {
            expand: true,
            cwd: '<%= frontend.path %>/js',
            src: [
              '**/*.js',
              '!libs/**/*'
            ]
          }
        ]
      }
    }
  });

  grunt.event.on('coverage', function(lcovFileContents, done){
      // Check below on the section "The coverage event" 
      done();
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-docco2');

  grunt.registerTask('default', ['build', 'serve', 'watch']);

  grunt.registerTask('build', ['babel', 'browserify', 'uglify', 'sass', 'autoprefixer']);
  grunt.registerTask('serve', ['concurrent:dev']);
  grunt.registerTask('test',  ['mocha', 'mocha_istanbul:coverage']);
  grunt.registerTask('doc',   ['docco']);
  //grunt.registerTask('watch', ['jshint', 'watch']);

  grunt.registerTask('coveralls', ['mocha_istanbul:coveralls', 'istanbul_check_coverage']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage', 'istanbul_check_coverage']);

};
