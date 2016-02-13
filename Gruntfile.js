module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['client/**/*.js'],
        dest: 'client/dist/built.js',
      }
    },
    uglify: {
       my_target: {
         files: {
           'client/dest/output.min.js': ['client/dist/built.js']
         }
       }
     },

     watch: {
       scripts: {
         files: ['client/**/*.js'],
         tasks: ['jshint'],
         options: {
           spawn: false,
         },
       },
     },

     jshint: {
      beforeconcat: ['client/**/*.js'],
      afterconcat: ['client/dist/built.js']
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};
