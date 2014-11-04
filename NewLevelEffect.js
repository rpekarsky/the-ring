var NewLevelEffect = (function(){
	function NewLevelEffect(num){
		this.layer = new PIXI.DisplayObjectContainer();
		this.newLevelSprite = new PIXI.Sprite.fromFrame('new_level');
		this.newLevelSprite.anchor.x = 0.5;
		this.newLevelSprite.anchor.y = 0.5;
		this.newLevelSprite.tint = 0x404040;


		this.levelText = new PIXI.BitmapText(num.toString(), {font: "50px Comfortaa", align: "right"});
		this.levelText.pivot.x = this.levelText.width/2;
		this.levelText.pivot.y = this.levelText.height/2;
		this.levelText.y = 45;

		this.layer.x = gameWidth/2;
		this.layer.y = gameHeight/2;
		this.layer.addChild(this.newLevelSprite);
		this.layer.addChild(this.levelText);
		// this.layer.visible = false;
	}
	NewLevelEffect.prototype = {
		show:function(container){
			// this.layer.visible = true;
			container.addChild(this.layer);

			this.layer.y = gameHeight + gameHeight/2;
			TweenLite.to(this.layer,0.4,{
				y:gameHeight/2
			});
			TweenLite.to(this.layer,0.5,{
				y:gameHeight/2-50,
				delay:0.4,
				onComplete:this.hide.bind(this)
			});

		},
		hide:function(){
			TweenLite.to(this.layer,0.2,{
				y:-gameHeight/2,
				delay:0.5,
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
