var FlareEffect = (function(){
	function FlareEffect(){
		this.layer = new PIXI.DisplayObjectContainer();
		this.flare = new PIXI.Sprite.fromFrame('flare');
		this.flare.anchor.x = this.flare.anchor.y = 0.5;
		this.layer.addChild(this.flare);
	}
	FlareEffect.prototype = {
		show:function(container,time){
			this.time = time||1;
			container.addChild(this.layer);
			this.layer.alpha = 0;
			TweenLite.to(this.layer,this.time/2,{
				alpha:1,
				onComplete:this.hide.bind(this)
			});
			return this;
		},
		slideRight:function(container,pixels,time){
			this.time = time||1;
			this.show(container,this.time);

			TweenLite.to(this.layer,this.time,{
				x: this.layer.x + pixels,
			});
			return this;
		},
		slideLeft:function(container,pixels,time){
			this.time = time||1;
			this.show(container,this.time);

			TweenLite.to(this.layer,this.time,{
				x: this.layer.x - pixels,
			});
			return this;
		},
		hide:function(){
			TweenLite.to(this.layer,this.time,{
				alpha:0,
				onComplete:function(){
					if(this.layer.parent){
						this.layer.parent.removeChild(this.layer);
						this.layer.removeStageReference();
					}
				}.bind(this)
			});
		}
	}
	return FlareEffect;
})();
