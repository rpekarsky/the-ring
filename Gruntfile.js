module.exports = function(grunt) {
  var files = [
    'stats.min.js',
    'signals.js',
    'signals-init.js',
    'victor.js',
    'pixi.js',
    'mousetrap.js',
    'howler.min.js',


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


    'MenuIcons.js',
    'Settings.js',
    'MainMenu.js',
    'States.js',


    'Game.js',
    'Maratron.js',
    'Zen.js',


    'BlockBorders.js',
    'Blocks.js',
    'Block.js',
    'Score.js',
    'NewBlocks.js',
    'init.js',
    'sounds.js',
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
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
	       mangle: {toplevel: false},
	       squeeze: {dead_code: false},
    	 codegen: {quote_keys: false}
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
