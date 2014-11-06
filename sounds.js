var Sound = (function () {
	var moveSnd,
		placeSnd,
		deathSnd,
		completeSnd,
		musicSnd,
		sounds;
	
	var Sound = {
		init:function(){
			// moveSnd = new buzz.sound( "sounds/move", {
			//     formats: [ "ogg" ],
			//     preload: true
			// });

			// placeSnd = new buzz.sound( "sounds/place", {
			//     formats: [ "ogg" ],
			//     preload: true
			// });

			// deathSnd = new buzz.sound( "sounds/death", {
			//     formats: [ "ogg" ],
			//     preload: true
			// });

			// completeSnd = new buzz.sound( "sounds/complete", {
			//     formats: [ "ogg" ],
			//     preload: true
			// });

			musicSnd = new buzz.sound( "sounds/music", {
			    formats: [ "ogg" ],
			    preload: true,
			    // autoplay: true,
			    loop: true,
			    // volume: 30
			});

			if(Storage.get('music-opt')){
				// musicSnd.fadeTo(100,0.8);
				// musicSnd.play();
			}
			Storage.changed.add(function(key,oldValue,enabled){
				if(key == 'music-opt'){
					if(enabled){
						musicSnd.unmute();
						musicSnd.play();
						// musicSnd.fadeTo(100,0.8);
					} else {
						// musicSnd.fadeOut(0.3,function(){
							musicSnd.pause();
							musicSnd.mute();	
						// });
					}
				}
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
			// if(name == 'move'){
			// 	new buzz.sound( "/sounds/move", {
			// 	    formats: [ "mp3" ]
			// 	}).play();
			// 	return;
			// }

			// new buzz.sound( "/sounds/move", {
			//     formats: [ "ogg" ],
			//     preload: true,
			//     autoplay: true,
			// });
			// if(Storage.get('sound-opt')){
			// 	if(sounds[name]){
			// 		sounds[name].stop();
			// 		sounds[name].play();
			// 	}
			// }
		}
	}
	return Sound;
})();