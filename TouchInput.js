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

	TouchInput = {
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
				// var CV = dir.clone().cross(lastDir);
				var CV = vec.clone().norm().cross(lastVec.norm());
					
				var LControl = (Math.abs(CV) < 0.1);
				// if(LControl){
				// }
				if(this.linearControl){
					LControl = true;
					if(Math.abs(CV) > 0.3){
						this.fingerControlPhases--;
						if(this.fingerControlPhases < -3){
							this.fingerControlPhases = -3;
							// console.log(this.fingerControlPhases);
							LControl = false;
							this.linearControl = false;
						}
					}
				}

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
					// addBlob();
				} else {

					this.fingerControlPhases++;
					if(this.fingerControlPhases > 10){
						this.fingerControlPhases = 10;
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
					addBlob();
				}
				
				lastVec = vec;
				lastDir = dir;
				lasttouch = touch.clone();
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
			Mousetrap.bind('left', TouchInput.turnedCCV.dispatch);
			Mousetrap.bind('right', TouchInput.turnedCV.dispatch);
			Mousetrap.bind('up', TouchInput.tapped.dispatch);
			Mousetrap.bind('down', TouchInput.back.dispatch);
		}
	};

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
		touched = true;
		moveStart = false;
		touch = new Victor(e.pageX,e.pageY);
		startVec = touch.clone();
	}

	function onmouseup(e){
		touched = false;
		if(moveStart == false){
			// if(touch.y < 50){
			// 	TouchInput.back.dispatch();
			// } else {
				TouchInput.tapped.dispatch(touch);
			// }
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
			touch = new Victor(e.pageX,e.pageY);
		}
	}

	function ontouchstart(e){
		touch = new Victor(e.touches[0].pageX,e.touches[0].pageY);
		startVec = touch.clone();
		moveStart = false;
	}

	function ontouchend(e){
		if(moveStart == false){
			// if(touch.y < 50){
			// 	TouchInput.back.dispatch();
			// } else {
				TouchInput.tapped.dispatch(touch);
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
		touch = new Victor(e.touches[0].pageX,e.touches[0].pageY);
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
