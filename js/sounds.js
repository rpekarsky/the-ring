var Sound = (function () {

	var COUNTS = {
		'move-fwd':  4,
		'move-back': 4,
		'place':     2,
		'complete':  0,
		'death':     0
	};

	var pools  = {};
	var cursor = {};
	var ready  = false;

	function loadPool(name, count){
		var arr = [];
		for (var i = 1; i <= count; i++) {
			arr.push(new buzz.sound("sounds/" + name + "/" + i, {
				formats: ["wav"],
				preload: true
			}));
		}
		return arr;
	}

	var Sound = {
		init: function(){
			for (var name in COUNTS) {
				pools[name]  = loadPool(name, COUNTS[name]);
				cursor[name] = 0;
			}
			ready = true;
		},
		play: function(name){
			if (!ready) return;
			if (!Storage.get('sound-opt')) return;
			var pool = pools[name];
			if (!pool || !pool.length) return;
			var snd = pool[cursor[name]++ % pool.length];
			snd.stop();
			snd.play();
		}
	};

	return Sound;
})();
