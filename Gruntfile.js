module.exports = function(grunt) {
  var files = [
    'stats.min.js',
    'signals.js',
    'signals-init.js',
    'victor.js',
    'pixi.js',
    'mousetrap.js',
    'buzz.min.js',


    'utils.js',
    'Storage.js',
    'Score.js',
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
    'LevelBlocked.js',
    'ScoreLine.js',
    'Settings.js',
    'MainMenu.js',
    'TitleScreen.js',
    'States.js',

    'NewLevelEffect.js',
    'FlareEffect.js',

    'Game.js',
    'Zen.js',
    'Koan.js',
    'Mondo.js',
    'Dharma.js',


    'BlockBorders.js',
    'Blocks.js',
    'Block.js',
    'Score.js',
    'NewBlocks.js',
    'init.js',
    'sounds.js',
    'Vibrate.js',
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
	       mangle: {toplevel: true},
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
