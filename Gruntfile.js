module.exports = function(grunt) {
  var files = [
    'signals.js',
    'signals-init.js',
    'victor.js',
    'pixi.js',
    'utils.js',
    'CustomPixiShader.js',
    'BlendShader.js',
    'Strip.js',
    'Quad.js',
    'TweenLite.js',
    'EasePack.min.js',
    'mousetrap.js',
    'Deadline.js',
    'Background.js',
    'Game.js',
    'BlockBorders.js',
    'Score.js',
    'Block.js',
    'NewBlocks.js',
    'init.js',
    'TouchInput.js'
  ];
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: files,
        dest: 'out/out.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'out/out.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
  grunt.registerTask('ugly', ['concat', 'uglify']);

};