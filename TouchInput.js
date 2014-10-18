var TouchInput = (function(){
	var lastVec;
	var blob;
	var touchBlob;
	var blobSplat;
	var blobSplatAnim;
	var moveStart = false
	var touch = new Victor(gameWidth/2,gameHeight/2);
	var startVec = touch.clone();
	TouchInput = {
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

			var deltaStart = new Victor(touch.x,touch.y).subtract(startVec);
			var deltaVec = new Victor(lastVec.x,lastVec.y).subtract(vec);
			var deltaAng = deltaVec.angleDeg();

			var blobVec = new Victor(blob.x,blob.y);
			var directionVec = blobVec.clone().subtract(touch);
			var direction = directionVec.clone().norm();
			var directionLength = directionVec.length();
			var centerDistance = new Victor(gameWidth/2,gameHeight/2).distance(blobVec);
			var maxSize = 120;
			var percentDis = (centerDistance/gameHeight)*1.8;
			var radiusMod = maxSize - (percentDis)*maxSize;
			var radiusMod = 30;
			var newPos = touch.clone().add(directionVec.norm().multiply({x:radiusMod,y:radiusMod}));
			blob.width = radiusMod*2;
			blob.height = radiusMod*2;
			blob.x += (newPos.x - blob.x)*0.1;
			blob.y += (newPos.y - blob.y)*0.1;
			
			if(moveStart && deltaVec.length() > 30){
				var CV = (vec.clone().norm().cross(lastVec.norm()) < 0);
				if(CV){
					GoLeft();
				} else {
					GoRight();
				}
				lastVec = vec;

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

			if(!moveStart && deltaStart.length() > 30){
				blob.alpha = 0.5;
				moveStart = true;
				lastVec = vec;
			}
		},
		initEvents:function(){
			document.addEventListener('touchmove',ontouchmove,false);
			document.addEventListener('touchstart',ontouchstart,false);
			document.addEventListener('touchend',ontouchend,false);	
			Mousetrap.bind('left', GoLeft);
			Mousetrap.bind('right', GoRight);
			Mousetrap.bind('up', GoUp);			
		}
	};

	function GoLeft () {
		Game.adder.move(-1);
	}
	function GoRight () {
		Game.adder.move(1);
	}
	function GoUp () {
		Game.adder.moveUp();
	}

	function ontouchstart(e){
		moveStart = false;
		// touch = new Victor(e.touches[0].pageX,e.touches[0].pageY);
		// var posx = blob.x-touch.x;
		// var posy = blob.y-touch.y;
		// lastVec = new Victor(posx,posy);
		// startVec = new Victor(touch.x,touch.y);
		// var blobVec = new Victor(blob.x,blob.y);
		// var directionVec = blobVec.clone().subtract(touch);
		// var direction = directionVec.clone().norm();
		// var directionLength = directionVec.length();
		// var maxSize = 40;
		// var centerDistance = new Victor(gameWidth/2,gameHeight/2).distance(blobVec);
		// var percentDis = (centerDistance/gameHeight)*1.8;
		// var radiusMod = maxSize - (percentDis)*maxSize;
		// radiusMod = 20;
		// var newPos = touch.add(directionVec.norm().multiply({x:radiusMod,y:radiusMod}));
		// blob.width = radiusMod*2;
		// blob.height = radiusMod*2;
		// blob.x = blob.x + (newPos.x - blob.x)*0.5;
		// blob.y = blob.y + (newPos.y - blob.y)*0.5;

		touchBlob.visible = true;
		blob.visible = true;
	}

	function ontouchend(e){
		if(moveStart == false){
			GoUp();
		}
		touch = new Victor(gameWidth/2,gameHeight/2);
		// blob.x = gameWidth/2;
		// blob.y = gameHeight/2;
		moveStart = false;
		touchBlob.visible = false
		blob.visible = false;
		blob.alpha = 0.1;
	}

	function ontouchmove(e){
		touch = new Victor(e.touches[0].pageX,e.touches[0].pageY);

		// var posx = blob.x-touch.x;
		// var posy = blob.y-touch.y;
		// var vec = new Victor(posx,posy);

		// touchBlob.x = touch.x;
		// touchBlob.y = touch.y;
		// touchBlob.visible = true;
		// blob.visible = true;
		// if(!lastVec){
		// 	lastVec = vec;
		// }

		// var deltaStart = new Victor(touch.x,touch.y).subtract(startVec);
		// var deltaVec = new Victor(lastVec.x,lastVec.y).subtract(vec);
		// var deltaAng = deltaVec.angleDeg();

		// var blobVec = new Victor(blob.x,blob.y);
		// var directionVec = blobVec.clone().subtract(touch);
		// var direction = directionVec.clone().norm();
		// var directionLength = directionVec.length();
		// var centerDistance = new Victor(gameWidth/2,gameHeight/2).distance(blobVec);
		// var maxSize = 120;
		// var percentDis = (centerDistance/gameHeight)*1.8;
		// var radiusMod = maxSize - (percentDis)*maxSize;
		// var radiusMod = 30;
		// var newPos = touch.add(directionVec.norm().multiply({x:radiusMod,y:radiusMod}));
		// blob.width = radiusMod*2;
		// blob.height = radiusMod*2;
		// blob.x += (newPos.x - blob.x)*0.1;
		// blob.y += (newPos.y - blob.y)*0.1;
		
		// if(moveStart && deltaVec.length() > 30){
		// 	var CV = (vec.clone().norm().cross(lastVec.norm()) < 0);
		// 	if(CV){
		// 		GoLeft();
		// 	} else {
		// 		GoRight();
		// 	}
		// 	lastVec = vec;

		// 	var blobSplat = new PIXI.Sprite.fromFrame('bokeh.png');
		// 	blobSplat.pivot.x = blobSplat.width/2;
		// 	blobSplat.pivot.y = blobSplat.height/2;
		// 	blobSplat.x = touch.x;
		// 	blobSplat.y = touch.y;
		// 	blobSplat.tint = 0x000000;
		// 	blobSplat.alpha = 0.3;
		// 	blobSplat.width = 60;
		// 	blobSplat.height = 60;

		// 	basestage.addChild(blobSplat);

		// 	TweenLite.to(blobSplat,0.3,{
		// 		alpha:0.03,
		// 		width:200,
		// 		height:200,
		// 		onComplete:function(){
		// 			basestage.removeChild(blobSplat)
		// 		}
		// 	});
		// }

		// if(!moveStart && deltaStart.length() > 30){
		// 	blob.alpha = 0.5;
		// 	moveStart = true;
		// 	lastVec = vec;
		// }
	}

	return TouchInput;
})();
