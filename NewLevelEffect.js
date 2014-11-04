var NewLevelEffect = (function(){
	function NewLevelEffect(num){
		this.layer = new PIXI.DisplayObjectContainer();
		this.newLevelSprite = new PIXI.Sprite.fromFrame('new_level');
		this.newLevelSprite.anchor.x = 0.5;
		this.newLevelSprite.anchor.y = 0.5;
		this.newLevelSprite.y = 60;
		this.newLevelSprite.tint = 0x707070;

		this.bg = new PIXI.Sprite.fromFrame('bokeh-blur.png');
		this.bg.anchor.x = 0.5;
		this.bg.anchor.y = 0.5;
		this.bg.width = gameWidth*2;
		this.bg.y = 20;
		this.bg.height = 250;
		this.bg.alpha = 1.2;
		this.bg.tint = 0x000000;

		// this.flare = new PIXI.Sprite.fromFrame('flare');
		// this.flare.anchor.x = this.flare.anchor.y = 0.5;


		this.levelText = new PIXI.BitmapText(num.toString(), {font: "60px Comfortaa", align: "right"});
		this.levelText.pivot.x = this.levelText.width/2;
		this.levelText.pivot.y = this.levelText.height/2;
		this.levelText.y = 0;
		this.levelText.x = 5;

		// this.flare.x = this.levelText.x - this.levelText.width/2;
		// this.flare.y = this.levelText.height/2-10;

		this.layer.x = gameWidth/2;
		this.layer.y = gameHeight/2;
		this.layer.addChild(this.bg);
		this.layer.addChild(this.newLevelSprite);
		this.layer.addChild(this.levelText);
		// this.layer.addChild(this.flare);
		this.binding = TouchInput.tapped.add(this.hide.bind(this), null, 1);
		this.binding.active = false;
	}
	NewLevelEffect.prototype = {
		show:function(container){
			this.binding.active = true;
			container.addChild(this.layer);

			this.layer.y = gameHeight/2-60;
			this.layer.alpha = 0;
			TweenLite.to(this.layer,0.2,{
				alpha:1,
			});

			// this.flare.alpha = 0;
			// TweenLite.to(this.flare,0.2,{
			// 	alpha:1
			// });

			// TweenLite.to(this.flare,0.8,{
			// 	alpha:0,
			// 	delay:0.5
			// });

			// TweenLite.to(this.flare,1,{
			// 	x:this.levelText.x + this.levelText.width/3,
			// });

			TweenLite.to(this.layer,1.3,{
				y:gameHeight/2-30,
				onComplete:this.hide.bind(this),
				// ease:Elastic.easeOut,
			});


            var flare = new FlareEffect()

			flare.layer.x = this.levelText.x - this.levelText.width/2;
			flare.layer.y = this.levelText.height/2-10;

			flare.slideRight(this.layer,this.levelText.width-this.levelText.width/4,2);

		},
		hide:function(){
			this.binding.active = false;
			TweenLite.to(this.layer,1,{
				y:gameHeight/2,
				alpha:-1,
				onComplete:function(){
					if(this.layer.parent){
						this.layer.parent.removeChild(this.layer);
						this.layer.removeStageReference();
					}
					// this.layer.visible = false;
				}.bind(this)
			});
		}
	}
	return NewLevelEffect;
})();
