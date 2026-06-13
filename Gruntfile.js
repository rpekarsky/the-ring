module.exports = function(grunt) {
  var files = [

    "lib/stats.min.js",
    "lib/signals.js",
    "lib/victor.min.js",
    "lib/pixi.js",
    "lib/buzz.min.js",
    "lib/TweenLite.js",
    "lib/EasePack.min.js",
    "lib/mousetrap.js",
    
    "js/signals-init.js",
    "js/utils.js",
    "js/Storage.js",
    "js/Score.js",
    "js/CustomPixiShader.js",
    "js/BlendShader.js",
    "js/Strip.js",
    "js/Quad.js",
    "js/Deadline.js",
    "js/Background.js",

    "js/MenuIcons.js",
    "js/LevelBlocked.js",
    "js/ScoreLine.js",
    "js/Settings.js",
    "js/MainMenu.js",
    "js/TitleScreen.js",
    "js/States.js",

    "js/NewLevelEffect.js",
    "js/FlareEffect.js",

    "js/Game.js",
    "js/Zen.js",
    "js/Koan.js",
    "js/Mondo.js",
    "js/Dharma.js",

    "js/BlockBorders.js",
    "js/Blocks.js",
    "js/Block.js",
    "js/Score.js",
    "js/NewBlocks.js",
    "js/init.js",
    "js/sounds.js",
    "js/Vibrate.js",
    "js/TouchInput.js"

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
    	codegen: {quote_keys: true}
      },
      dist: {
        files: {
          'out/out.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
  grunt.registerTask('ugly', ['concat', 'uglify']);

};
