var TouchInput = (function(){
	var lastVec;
	var lastCenterVec;
	var blob;
	var touchBlob;
	var blobSplat;
	var blobSplatAnim;
	var moveStart = false
	var touch = new Victor(gameWidth/2,gameHeight/2);
	var lasttouch = touch.clone();
	var startVec = touch.clone();
	var lastDir = new Victor(0,0);
	var touched = false;
	var gameRect = new PIXI.Rectangle(0,0,gameWidth,gameHeight);
	var lastTouchTime = 0;
	var TOUCH_DELAY = 30;

	var KEY_REPEAT_MS = 100;
	var keyRepeats = {};
	function startKeyRepeat(name, action){
		if (keyRepeats[name]) return;
		action();
		keyRepeats[name] = setInterval(action, KEY_REPEAT_MS);
	}
	function stopKeyRepeat(name){
		if (keyRepeats[name]) {
			clearInterval(keyRepeats[name]);
			delete keyRepeats[name];
		}
	}
	TouchInput = {
		enabled:true,
		fingerControlPhases:0,
		tapped:new Signal(),
		back:new Signal(),
		turnedCV:new Signal(),
		turnedCCV:new Signal(),
		init:function(){
			blob = new PIXI.Sprite.fromFrame('bokeh.png');
			blob.pivot.x = blob.width/2;
			blob.pivot.y = blob.height/2;
			blob.x = gameWidth/2;
			blob.y = gameHeight/2;
			blob.tint = 0x000000;
			blob.alpha = 0.1;
			blob.visible = false;

			touchBlob = new PIXI.Sprite.fromFrame('bokeh.png');
			touchBlob.pivot.x = touchBlob.width/2;
			touchBlob.pivot.y = touchBlob.height/2;
			touchBlob.x = gameWidth/2;
			touchBlob.y = gameHeight/2;
			touchBlob.width = 80;
			touchBlob.height = 80;
			touchBlob.alpha = 0.2;
			touchBlob.tint = 0x000000;
			touchBlob.visible = false;
			basestage.addChild(blob);
			basestage.addChild(touchBlob);

			this.initEvents();

			rendered.add(this.update.bind(this));
		},
		update:function(){
			if(!this.enabled) return;
			var moved = false;
			// console.log('update call');
			var posx = blob.x-touch.x;
			var posy = blob.y-touch.y;
			var vec = new Victor(posx,posy);

			touchBlob.x = touch.x;
			touchBlob.y = touch.y;
			if(!lastVec){
				lastVec = vec;
			}
			var deltaStart = touch.clone().subtract(startVec);
			var deltaVec = new Victor(lastVec.x,lastVec.y).subtract(vec);
			var deltaTouchVec = lasttouch.clone().subtract(touch);
			var deltaAng = deltaVec.angleDeg();
			var blobVec = new Victor(blob.x,blob.y);
			var directionVec = blobVec.clone().subtract(touch);
			var direction = directionVec.clone().norm();
			var directionLength = directionVec.length();
			var centerDistance = new Victor(gameWidth/2,gameHeight/2).distance(blobVec);
			var maxSize = 120;
			var percentDis = (centerDistance/gameHeight)*1.8;
			var radiusMod = maxSize - (percentDis)*maxSize + 10;
			var radiusMod = 30;
			var newPos = touch.clone().add(directionVec.norm().multiply({x:radiusMod,y:radiusMod}));
			blob.width = radiusMod*2;
			blob.height = radiusMod*2;
			blob.x += (newPos.x - blob.x)*0.2;
			blob.y += (newPos.y - blob.y)*0.2;
			if(moveStart){
				touchBlob.visible = true;
				blob.visible = true;
			}

			// var dir = lasttouch.clone().subtract(touch).norm();
			var dir = vec.clone().subtract(touch).norm();
			if(moveStart && deltaTouchVec.length() > 20){
				// for (var i = 0; i < deltaTouchVec.length()-20; i+=20) {
					// var deltaTouchVecUpdate = lasttouch.clone().subtract(touch);
					// console.log('call');
					// var CV = dir.clone().cross(lastDir);
					var CV = vec.clone().norm().cross(lastVec.norm());
						
					var LControl = (Math.abs(CV) < 0.1);
					// if(LControl){
					// }
					if(this.linearControl){
						LControl = true;
						if(Math.abs(CV) > 0.3){
							this.fingerControlPhases--;
							if(this.fingerControlPhases < -5){
								this.fingerControlPhases = -5;
								// console.log(this.fingerControlPhases);
								LControl = false;
								this.linearControl = false;
							}
						}
					}
					// LControl = true;
					if(LControl){
						this.linearControl = true; // finger circle
						var centerVec = new Victor(gameWidth/2 - touch.x, gameHeight/2 - touch.y);
						var CV = (centerVec.clone().norm().cross(lastCenterVec.norm()) < 0);
						lastCenterVec = centerVec;
						if(CV){
							TouchInput.turnedCV.dispatch();

						} else {
							TouchInput.turnedCCV.dispatch();
						}
						moved = true;
						// addBlob();
					} else {

						this.fingerControlPhases++;
						if(this.fingerControlPhases > 5){
							this.fingerControlPhases = 5;
						}
						// console.log(this.fingerControlPhases);

						// this.linearControl = false;
						// console.log(Math.abs(CV));


						if(!lastVec){
							lastVec = vec;
						}
						var isCV = (CV < 0);
						if(isCV){
							TouchInput.turnedCV.dispatch();
						} else {
							TouchInput.turnedCCV.dispatch();
						}
						moved = true;
						addBlob();
					}
					// if(moved){
					// 	TouchInput.update();
					// }
					lastVec = vec;
					lastDir = dir;
					lasttouch = touch.clone();
				// };
			}

			if(!moveStart && deltaStart.length() > 10){
				blob.alpha = 0.1;
				moveStart = true;
				lasttouch = touch.clone();
				this.fingerControlPhases = 0;
				lastDir = dir;
				lastVec = vec;
				lastCenterVec = new Victor(gameWidth/2 - touch.x, gameHeight/2 - touch.y);
			}
		},
		initEvents:function(){
			document.addEventListener('mousemove',onmousemove,false);
			document.addEventListener('mousedown',onmousedown,false);
			document.addEventListener('mouseup',onmouseup,false);	

			document.addEventListener('touchmove',ontouchmove,false);
			document.addEventListener('touchstart',ontouchstart,false);
			document.addEventListener('touchend',ontouchend,false);	
			Mousetrap.bind(['left', 'a'], function(){
				startKeyRepeat('left', function(){ TouchInput.turnedCCV.dispatch(); });
				return false;
			});
			Mousetrap.bind(['left', 'a'], function(){ stopKeyRepeat('left'); return false; }, 'keyup');

			Mousetrap.bind(['right', 'd'], function(){
				startKeyRepeat('right', function(){ TouchInput.turnedCV.dispatch(); });
				return false;
			});
			Mousetrap.bind(['right', 'd'], function(){ stopKeyRepeat('right'); return false; }, 'keyup');

			Mousetrap.bind(['up', 'w', 'space', 'enter'], function(){
				TouchInput.tapped.dispatch(new Victor(gameWidth/2, gameHeight/2));
				return false;
			});
			Mousetrap.bind(['down', 's', 'esc', 'backspace'], function(){ TouchInput.back.dispatch(); return false; });

			window.addEventListener('blur', function(){
				for (var name in keyRepeats) stopKeyRepeat(name);
			});
		}
	};

	// Canvas is CSS-letterboxed but renders at fixed gameWidth × gameHeight.
	// Convert page coords (mouse/touch event) into the canvas's internal coordinate space.
	function pageToCanvas(pageX, pageY){
		var rect = renderer.view.getBoundingClientRect();
		var sx = gameWidth  / rect.width;
		var sy = gameHeight / rect.height;
		return new Victor((pageX - rect.left) * sx, (pageY - rect.top) * sy);
	}

	function addBlob(){
		var blobSplat = new PIXI.Sprite.fromFrame('bokeh.png');
		blobSplat.pivot.x = blobSplat.width/2;
		blobSplat.pivot.y = blobSplat.height/2;
		blobSplat.x = touch.x;
		blobSplat.y = touch.y;
		blobSplat.tint = 0x000000;
		blobSplat.alpha = 0.3;
		blobSplat.width = 60;
		blobSplat.height = 60;

		basestage.addChild(blobSplat);

		TweenLite.to(blobSplat,0.3,{
			alpha:0.03,
			width:200,
			height:200,
			onComplete:function(){
				basestage.removeChild(blobSplat)
			}
		});
	}

	function onmousedown(e){
		lastTouchTime = Date.now();
		touched = true;
		moveStart = false;
		touch = pageToCanvas(e.pageX, e.pageY);
		startVec = touch.clone();
	}

	function onmouseup(e){
		touched = false;
		if(moveStart == false){

			if(gameRect.contains(touch.x,touch.y)){
				
			// if(touch.y < 50){
			// 	TouchInput.back.dispatch();
			// } else {
				if(Date.now() - lastTouchTime > TOUCH_DELAY){
					TouchInput.tapped.dispatch(touch);
				}
			// }
			}
		}
		touch = new Victor(gameWidth/2,gameHeight/2);
		startVec = touch.clone();
		moveStart = false;
		touchBlob.visible = false
		blob.visible = false;
		blob.alpha = 0.1;
	}

	function onmousemove(e){
		if(touched){
			var p = pageToCanvas(e.pageX, e.pageY);
			if(gameRect.contains(p.x, p.y)){
				touch = p;
				TouchInput.update();
			}
		}
	}

	function ontouchstart(e){
		lastTouchTime = Date.now();
		touch = pageToCanvas(e.touches[0].pageX, e.touches[0].pageY);
		startVec = touch.clone();
		moveStart = false;
	}

	function ontouchend(e){
		if(moveStart == false){

			if(gameRect.contains(touch.x,touch.y)){
				
			// if(touch.y < 50){
			// 	TouchInput.back.dispatch();
			// } else {
				if(Date.now() - lastTouchTime > TOUCH_DELAY){
					TouchInput.tapped.dispatch(touch);
				}
				// TouchInput.tapped.dispatch(touch);
			// }
			}
			// if(touch.y < 50){
			// 	TouchInput.back.dispatch();
			// } else {
				// TouchInput.tapped.dispatch(touch);
			// }
		}
		touch = new Victor(gameWidth/2,gameHeight/2);
		startVec = touch.clone();
		moveStart = false;
		touchBlob.visible = false
		blob.visible = false;
		blob.alpha = 0.1;
	}

	function ontouchmove(e){
		var p = pageToCanvas(e.touches[0].pageX, e.touches[0].pageY);
		if(gameRect.contains(p.x, p.y)){
			touch = p;
		}
	}
	// TouchInput.tapped.add(function(){
	// 	console.log('tapped');
	// });

	// TouchInput.turnedCV.add(function(){
	// 	console.log('turnedCV');
	// });

	// TouchInput.turnedCCV.add(function(){
	// 	console.log('turnedCCV');
	// });
	return TouchInput;
})();
