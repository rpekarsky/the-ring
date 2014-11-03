
var LevelBlocked = (function () {
	function LevelBlocked(){
		this.layer = new PIXI.DisplayObjectContainer();
		this.layer.x = gameWidth/2;
		this.layer.y = gameHeight/2;
		this.layer.pivot.x = gameWidth/2;
		this.layer.pivot.y = gameHeight/2;
		this.info = new PIXI.Sprite.fromFrame('blocked-level');
		this.info.tint = 0x404040;
		this.info.x = gameWidth/2;
		this.info.y = gameHeight/2;
		this.info.pivot.x = this.info.width/2;
		this.info.pivot.y = this.info.height/2;

		this.scoreLine = new ScoreLine();
		this.scoreLine.layer.x = gameWidth/2;
		this.scoreLine.layer.y = 30;


		this.scoreLineNeed = new ScoreLine();
		this.scoreLineNeed.layer.x = gameWidth/2;
		this.scoreLineNeed.layer.y = gameHeight/2-25-5;
		this.scoreLineNeed.layer.scale.set(1.9);

		// this.needScoreText = new PIXI.BitmapText('0', {font: "40px Comfortaa", align: "right"});
		// this.needScoreText.x = gameWidth/2 - this.needScoreText.width/2;
		// this.needScoreText.y = gameHeight/2-25-10;

		this.binding = TouchInput.tapped.add(this.processTouch.bind(this), null, 1);
		this.binding.active = false;

		this.layer.addChild(this.info);
		// this.layer.addChild(this.needScoreText);
		this.layer.addChild(this.scoreLine.layer);
		this.layer.addChild(this.scoreLineNeed.layer);
		basestage.addChild(this.layer);
	};	
	LevelBlocked.prototype = {
		init:function(options){
			this.options = options || {};

			var needScore = this.options.needScore || 150000;
			// this.needScoreText.setText(needScore.toString());
			// this.needScoreText.x = gameWidth/2 - this.needScoreText.width/2;	

			this.scoreLine.set(Score.getTotal());
			this.scoreLineNeed.set(needScore);

			this.layer.visible = false;
			this.binding.active = false;

			// this.renderedBinding = rendered.add(this.updateScorePos.bind(this));
			// this.renderedBinding.active = false;
		},
		processTouch:function(){
			states.back();
			return false;
		},
		// updateScorePos:function(){
		// 	this.needScoreText.x = gameWidth/2 - this.needScoreText.width/2;
		// },
		close:function(){
			this.scoreLine.hide();
			this.scoreLineNeed.hide();
			TouchInput.enabled = true;
			this.binding.active = false;
			// this.renderedBinding.active = false;
			// this.layer.visible = false;
			this.animateOut();
		},
		open:function(){
			this.scoreLine.show();
			this.scoreLineNeed.show();
			// this.renderedBinding.active = true;
			TouchInput.enabled = false;
			this.layer.visible = true;
			this.binding.active = true;
			this.animate();
		},
		animate:function(){
			// this.layer.x = gameWidth/2;
			// this.layer.y = gameHeight/2;
			// this.layer.pivot.x = gameWidth/2;
			// this.layer.pivot.y = gameHeight/2;
			
			
			this.layer.scale.x = this.layer.scale.y = 0.6;
			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,0.9,{
				x:1,
				y:1,
				ease:Elastic.easeOut
			});
		},
		animateOut:function(){
			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,0.1,{
				x:0,
				y:0,
				onComplete:function(){
					this.layer.visible = false;
				}.bind(this),
			});
		}
	}

	var instance = false;
	LevelBlocked.create = function(){
		if(instance){
			// console.log('return created');
			return instance;
		}
		instance = new LevelBlocked();
		return instance;
	}
	return LevelBlocked;
})();
