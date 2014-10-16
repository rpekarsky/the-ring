module.exports = function(grunt) {
  var files = ['pixi.js','utils.js','CustomPixiShader.js','BlendShader.js','Strip.js','Quad.js','TweenLite.js','EasePack.min.js','mousetrap.js','Deadline.js','Background.js','Game.js','BlockBorders.js','Block.js','NewBlocks.js','init.js','input.js'];
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: files,
        dest: 'out.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'out.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat', 'uglify']);

};