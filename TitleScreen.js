var TitleScreen = (function () {
	function TitleScreen(){
		this.rtx = new PIXI.RenderTexture(24*20, 140);
		this.ringStage = new PIXI.Stage(0x000000);
		this.bg = new PIXI.Graphics();
		this.ringLayer = new PIXI.DisplayObjectContainer();
		this.layer = new PIXI.DisplayObjectContainer();
		this.ring = new PIXI.Strip(this.rtx);
		this.logo = new PIXI.Sprite.fromFrame('logo');
		this.flare = new PIXI.Sprite.fromFrame('flare');
	}
	TitleScreen.prototype = {
		init:function(){
			if(this.inited){
				return
			}
	        this.bg.beginFill(0x000000);
	        this.bg.alpha = 0.3;
	        this.bg.drawRect(0, 120-5, 24*20, 2);
	        this.bg.endFill();

	        this.bg.beginFill(0x000000);
	        this.bg.alpha = 0.1;
	        this.bg.drawRect(0, 0, 24*20, 100);
	        this.bg.endFill();

			this.ring.x = gameWidth/2;
			this.ring.y = gameHeight/2;
			this.ring.alpha = 1;

			this.ringStage.addChild(this.ringLayer);
			this.ringLayer.addChild(this.bg);
			this.layer.addChild(this.ring);
			this.layer.addChild(this.logo);
			this.layer.addChild(this.flare);
			this.layer.pivot.x = gameWidth/2;
			this.layer.pivot.y = gameHeight/2;

			this.layer.x = gameWidth/2;
			this.layer.y = gameHeight/2;


			this.logo.x = gameWidth/2;
			this.logo.y = gameHeight/2;

			this.logo.pivot.x = this.logo.width/2;
			this.logo.pivot.y = this.logo.height/2;
			this.logo.alpha = 0.6;



			// this.flare.pivot.x = this.flare.width/2;
			// this.flare.pivot.y = this.flare.height/2;
			this.flare.anchor.x = 0.5;
			this.flare.anchor.y = 0.5;


			this.renderedBinding = rendered.add(this.render.bind(this));

			this.renderedBinding.active = false;

			TouchInput.back.add(function(){states.back()});
			this.tappedBinding = TouchInput.tapped.add(this.tap.bind(this));
			this.tappedBinding.active = false;
			basestage.addChild(this.layer);
			this.inited = true;
		},
		tap:function(){
			states.open(states.states.menu);
			return false;
		},
		close:function(){
			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			if(this.showAnimScale){
				this.showAnimScale.kill();
			}

			if(this.hideAnim){
				this.hideAnim.restart();
			} else {
				this.hideAnim = TweenLite.to(this.layer.scale,0.2,{
					x:0,
					y:0,
					onComplete:function(){
						this.layer.visible = false;
						this.ring.visible = false;
					}.bind(this)
				});	
			}

		},
		open:function(){


			this.flare.scale.set(2);
			this.flare.x = gameWidth/2-25;
			this.flare.y = gameHeight/2-20;


			this.flare.alpha = 0;
			TweenLite.to(this.flare,0.3,{
				alpha:1
			});
			TweenLite.to(this.flare,1,{
				x:gameWidth/2-5
			});
			TweenLite.to(this.flare,0.3,{
				delay:0.7,
				alpha:0
			});

			// TweenLite.to(this.flare,0.3,{
			// 	alpha:0.7
			// });
			// TweenLite.to(this.flare,1,{
			// 	y:gameHeight/2+20
			// });
			// TweenLite.to(this.flare,0.3,{
			// 	delay:1,
			// 	alpha:0
			// });

			this.renderedBinding.active = true;
			this.tappedBinding.active = true;

			this.ring.visible = true;
			this.layer.visible = true;
			background.changeColor('cold blue');

			this.layer.y = gameHeight/2;
			this.layer.scale.x = 0.4;
			this.layer.scale.y = 0.4;

			if(this.hideAnim){
				this.hideAnim.kill();
			}
			
			if(this.showAnimScale){
				this.showAnimScale.restart();
			} else {
				this.showAnimScale = TweenLite.to(this.layer.scale,1,{
					x:1,
					y:1,
					ease:Elastic.easeOut
				});				
			}
		},
		render:function(){
		    this.rtx.clear();
		    this.rtx.render(this.ringStage);
		}
	}
	var instance = false;
	TitleScreen.create = function(){
		if(instance){
			return instance;
		}
		instance = new TitleScreen();
		return instance;
	}
	return TitleScreen;
})();
