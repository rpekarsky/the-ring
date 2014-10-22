var Sound = (function () {
	var moveSnd,
		placeSnd,
		deathSnd,
		completeSnd,
		musicSnd,
		sounds;
	
	var Sound = {
		init:function(){
			moveSnd = new Howl({
			  urls: ['sounds/move.mp3']
			});
			placeSnd = new Howl({
			  urls: ['sounds/place.mp3']
			});
			deathSnd = new Howl({
			  urls: ['sounds/death.mp3']
			});
			completeSnd = new Howl({
			  urls: ['sounds/complete.mp3']
			});
			musicSnd = new Howl({
			  	urls: ['sounds/music.mp3'],
			  	autoplay: true,
			  	volume: 0.3,
		  		loop: true,
			});
			sounds = {
				'move':moveSnd,
				'place':placeSnd,
				'complete':completeSnd,
				'death':deathSnd,
				// 'music':musicSnd,
			}
		},
		play:function(name){
			if(sounds[name]){
				sounds[name].play();
			}
		}
	}
	Sound.init();
	return Sound;
})();