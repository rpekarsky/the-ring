var Vibrate = (function () {
	// enable vibration support
	navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	var enabled = false;
	if (navigator.vibrate) {
		enabled = true;
	}
	// enabled = false;
	var Vibrate = function(ms){
		if(Storage.get('vibro-opt') && enabled){
			navigator.vibrate(ms);
		}
	}

	// Vibrate.init();
	return Vibrate;
})();