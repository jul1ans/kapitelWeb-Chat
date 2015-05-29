module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/main.css': 'style/main.scss'
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/app.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/myapp.min.js': ['dist/myapp.js']
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
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },

    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/myapp.js': 'dist/app.js'
        }
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
      options: {
        // Task-specific options go here. 
      },
      no_dest: {
        src: 'dist/main.css' // globbing is also possible here 
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('default', ['build', 'serve', 'watch']);

  grunt.registerTask('build', ['concat', 'babel', 'uglify', 'sass', 'autoprefixer']);
  grunt.registerTask('serve', ['nodemon', 'open:dev', 'reload']);
  grunt.registerTask('test',  ['mocha', 'mocha_istanbul:coverage']);
  grunt.registerTask('doc',   ['docco2']);
  //grunt.registerTask('watch', ['jshint', 'watch']);

  grunt.registerTask('coveralls', ['mocha_istanbul:coveralls', 'istanbul_check_coverage']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage', 'istanbul_check_coverage']);

};
