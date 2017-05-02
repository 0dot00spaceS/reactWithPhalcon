module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-php');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  const path = require('path');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      dev: 'server',
      dist: 'dist',
      build: '<%= grunt.template.today("yyyymmdd") %>'
    },
    // local server
    php: {
      server: {
        options: {
          host: 'localhost',
          port: process.env.PORT || '8010',
          base: '<%= project.dev %>/public',
          router:'<%= project.dev %>/.htrouter.php',
          env:{
            APPLICATION_ENV : 'development'
          }
        }
      }
    },
    browserSync: {
        dev: {
            bsFiles: {
                src: ['server/**/*.php', '<%= project.dev %>/public/js/**/*.js']
            },
            options: {
                proxy: '127.0.0.1:8010', //our PHP server
                port: 8080, // our new port
                open: true,
                watchTask: true
            }
        }
    },
    // watch for file changes
    watch: {
      // styles: {
      //   files: ['<%= project.dev %>/less/**/*.less'],
      //   tasks: ['less:dev'],
      //   options: {
      //     livereload: true
      //   }
      // },
      scripts: {
        files: ['<%= project.dev %>/public/src/js/**/*.js', 'Gruntfile.js'],
        tasks: ['webpack:build', 'jshint:dev'], // !important
        options: {
          livereload: true,
          reload: true
        }
      }
    },
    // compile less
    // less: {
    //   dev: {
    //     files: {
    //       '<%= project.dev %>/css/style.css': ['<%= project.dev %>/less/style.less']
    //     }
    //   }
    // },
    // lint js
    jshint : {
      dev: ['<%= project.dev %>/public/src/js/**/*.js', '<%= project.dev %>/js/index.js'],
      options: {
        reporter: require('jshint-stylish')
      }
    },
    // copy
    // copy: {
    //   setup: {
    //     expand: true,
    //     cwd: '<%= project.dev %>/public/vendor/font-awesome/fonts/',
    //     src: ['*.{otf,ttf,svg,eot,woff,woff2}'],
    //     dest: '<%= project.dev %>/public/fonts/'
    //   }
    // },
    // webpack !pay attention to this task!
    webpack: {
      build: {
        entry: ['./server/public/src/js/index.js'],
        output: {
          path: __dirname +'/server/public/js/',
          filename: 'bundle.js'
        },
        resolve: {
           // options for resolving module requests
           // (does not apply to resolving to loaders)

           modules: [
             "node_modules",
             path.resolve(__dirname, "/server/public/src/js")
           ],
           // directories where to look for modules

           extensions: [".js", ".json", ".jsx", ".css"],
         },
        stats: {
          colors: true,
          modules: true,
          reasons: true
        },
        storeStatsTo: 'webpackStats',
        progress: true,
        failOnError: true,
        watch: true,
        module: {
          loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader", query: {
                presets: ['es2015', 'react']
            } }
          ]
        }
      }
    }
  });
  // Tasks
  grunt.registerTask('default', ['develop']);
  grunt.registerTask('develop', [
    'php:server',
    'browserSync',
    'watch'
    ]);

  grunt.registerTask('setup', ['copy:setup']);
};