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

			// Music & SFX disabled: the original 2014 build shipped licensed audio
			// (PremiumBeat) that isn't redistributable in this public source repo.
			// All audio-related init, wheel-volume, M-mute, and focus/blur handlers
			// are commented out to avoid 404s on sounds/music.ogg and runtime errors
			// on undefined musicSnd. To re-enable when you have a CC0 track:
			//   1. drop the file at sounds/music.ogg
			//   2. uncomment the block below
			//
			// var savedVolume = Storage.get('music-volume');
			// var volume = (savedVolume == null) ? 50 : savedVolume;
			// musicSnd = new buzz.sound( "sounds/music", {
			//     formats: [ "ogg" ],
			//     preload: true,
			//     loop: true,
			//     volume: volume
			// });
			// var startMusic = function(){
			//     if(Storage.get('music-opt')){ musicSnd.play(); }
			//     document.removeEventListener('touchstart', startMusic);
			//     document.removeEventListener('mousedown', startMusic);
			//     document.removeEventListener('keydown', startMusic);
			// };
			// document.addEventListener('touchstart', startMusic);
			// document.addEventListener('mousedown', startMusic);
			// document.addEventListener('keydown', startMusic);
			// document.addEventListener('wheel', function(e){
			//     var v = musicSnd.getVolume();
			//     v = Math.max(0, Math.min(100, v + (e.deltaY < 0 ? 5 : -5)));
			//     musicSnd.setVolume(v);
			//     Storage.set('music-volume', v);
			//     e.preventDefault();
			// }, {passive: false});
			// Mousetrap.bind('m', function(){
			//     Storage.set('music-opt', !Storage.get('music-opt'));
			//     return false;
			// });
			// Storage.changed.add(function(key,oldValue,enabled){
			//     if(key == 'music-opt'){
			//         if(enabled){ musicSnd.unmute(); musicSnd.play(); }
			//         else { musicSnd.pause(); musicSnd.mute(); }
			//     }
			// });
			// sounds = {
			// 	'move':moveSnd,
			// 	'place':placeSnd,
			// 	'complete':completeSnd,
			// 	'death':deathSnd,
			// 	// 'music':musicSnd,
			// }
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

	// window.addEventListener('focus', function(){
	//     if(Storage.get('music-opt')){ musicSnd.play(); }
	// });
	// window.addEventListener('blur', function(){
	//     musicSnd.stop();
	// });
	return Sound;
})();