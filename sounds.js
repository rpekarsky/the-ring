var Sound = (function () {
	var moveSnd = new Howl({
	  urls: ['sounds/move.mp3']
	});
	var placeSnd = new Howl({
	  urls: ['sounds/place.mp3']
	});
	var deathSnd = new Howl({
	  urls: ['sounds/death.mp3']
	});
	var completeSnd = new Howl({
	  urls: ['sounds/complete.mp3']
	});
	var musicSnd = new Howl({
	  	urls: ['sounds/music.mp3'],
	  	autoplay: true,
	  	volume: 0.3,
  		loop: true,
	});
	var sounds = {
		'move':moveSnd,
		'place':placeSnd,
		'complete':completeSnd,
		'death':deathSnd,
		// 'music':musicSnd,
	}
	return {
		play:function(name){
			if(sounds[name]){
				sounds[name].play();
			}
		}
	}
})();