var ScoreLine = (function () {
	function ScoreLine(){
		this.layer = new PIXI.DisplayObjectContainer();
		this.scoreText = new PIXI.BitmapText('', {font: "25px Comfortaa", align: "right"});
		this.scoreText.alpha = 0.9;
		this.scoreText.x = 22;
		this.scoreText.y = 0;
		this.layer.addChild(this.scoreText);

		this.scoreIcon = new PIXI.Sprite.fromFrame('star');
		this.scoreIcon.tint = 0x404040;
		this.scoreIcon.scale.set(0.7);
		this.scoreIcon.x = 0;
		this.scoreIcon.y = 0;
		this.layer.addChild(this.scoreIcon);

		this.renderedBinding = rendered.add(this.update.bind(this));
		this.renderedBinding.active = false;
		this.layer.visible = false;
	}
	ScoreLine.prototype = {
		set:function(num){
			if(!num){
				this.scoreText.visible = false;
				this.scoreIcon.visible = false;
			} else {
				this.scoreText.visible = true;
				this.scoreIcon.visible = true;

				this.scoreText.setText(num.toString());
				this.update();
			}
		},
		show:function(){
			this.layer.visible = true;
			this.renderedBinding.active = true;
			this.update();
		},
		hide:function(){
			this.layer.visible = false;
			this.renderedBinding.active = false;
		},
		update:function(){
			this.layer.pivot.x = this.layer.width/2/this.layer.scale.x;
			this.layer.pivot.y = 25/2/this.layer.scale.y;
		}
	}
	return ScoreLine;
})();
