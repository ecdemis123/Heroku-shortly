module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js',
      },
    },
    uglify: {
       my_target: {
         files: {
           'dest/output.min.js': ['src/input1.js', 'src/input2.js']
         }
       }
     },
     scripts: {
       files: ['**/*.js'],
       tasks: ['jshint'],
       options: {
         spawn: false,
       },
     },

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
