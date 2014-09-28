var Background = (function(){
	var bgColor = 0x1a6dff;
	var bgColor2 = 0x16f5ff;
	function Particle(layer){
		this.layer = layer;
		this.flare = new PIXI.Sprite.fromFrame('flare.png');
		this.delay = Math.random()*5;
		this.creating();
	}
	Particle.prototype = {
		creating:function(){
			this.layer.addChild(this.flare);
			this.duration = Math.random()*2+0.5;
			this.direction = {x:Math.random()-0.5,y:Math.random()-0.5};
			this.flare.alpha = 0;
			this.flare.tint = (Math.random()>0.5)?bgColor2:bgColor;
			this.flare.scale.set(this.scale*2);
			this.flare.pivot.x = this.flare.width/2;
			this.flare.pivot.y = this.flare.height/2;
			this.flare.x = Math.random()*360*2-360/2;
			this.flare.y = Math.random()*480*2-480/2;
			this.scale = Math.random()+0.2;
			// this.alpha = Math.random()*0.4+0.6;
			this.alpha = 1;

			TweenLite.to(this.flare,this.duration,{
				delay:this.delay,
				x:this.flare.x + this.direction.x*100,
				y:this.flare.y + this.direction.y*100,
				alpha:this.alpha,
				onComplete:this.anim.bind(this)
			});

			TweenLite.to(this.flare.scale,this.duration,{
				x:this.scale,
				y:this.scale,
			});

			this.delay = 0;
		},
		fading:function(){
			TweenLite.to(this.flare,this.duration*3,{
				x:this.flare.x + this.direction.x*300,
				y:this.flare.y + this.direction.y*300,
				alpha:0,
				onComplete:this.creating.bind(this)
			});

			TweenLite.to(this.flare.scale,this.duration*2.8,{
				x:this.flare.scale.x*2,
				y:this.flare.scale.x*2,
			});
		},
		anim:function(){
			TweenLite.to(this.flare,this.duration,{
				x:this.flare.x + this.direction.x*100,
				y:this.flare.y + this.direction.y*100,
				alpha:this.alpha,
				onComplete:this.fading.bind(this)
			});
		}
	}

	function ParticleDark(layer){
		this.layer = layer;
		this.flare = new PIXI.Sprite.fromFrame('flare.png');
		this.delay = Math.random()*5;
		this.creating();
	}
	ParticleDark.prototype = {
		creating:function(){
			this.layer.addChild(this.flare);
			this.duration = Math.random()*2+0.5;
			this.direction = {x:Math.random()-0.5,y:Math.random()-0.5};
			this.flare.alpha = 0;
			this.flare.tint = 0x000000;
			this.flare.x = Math.random()*360*2-360/2;
			this.flare.y = Math.random()*480*2-480/2;
			this.flare.scale.set(Math.random()*2+0.4);

			TweenLite.to(this.flare,this.duration,{
				delay:this.delay,
				x:this.flare.x + this.direction.x*100,
				y:this.flare.y + this.direction.y*100,
				alpha:Math.random()*0.4+0.5,
				onComplete:this.anim.bind(this)
			});
			this.delay = 0;
		},
		fading:function(){
			TweenLite.to(this.flare,this.duration*3,{
				x:this.flare.x + this.direction.x*300,
				y:this.flare.y + this.direction.y*300,
				alpha:0,
				onComplete:this.creating.bind(this)
			});
		},
		anim:function(){
			TweenLite.to(this.flare,this.duration,{
				x:this.flare.x + this.direction.x*100,
				y:this.flare.y + this.direction.y*100,
				alpha:Math.random()*0.4+0.5,
				onComplete:this.fading.bind(this)
			});
		}
	}


	function ParticleMini(){
		this.flare = new PIXI.Sprite.fromFrame('flare.png');
		this.delay = Math.random()*5;
		this.creating();
	}
	ParticleMini.prototype = {
		creating:function(){
			this.duration = Math.random()*1+0.5;
			this.direction = {x:Math.random()-0.5,y:Math.random()-0.5};
			this.flare.alpha = 0;
			this.flare.tint = (Math.random()>0.5)?bgColor2:bgColor;
			this.flare.x = Math.random()*360*2-360/2;
			this.flare.y = Math.random()*480*2-480/2;
			this.flare.scale.set(0.2);

			TweenLite.to(this.flare,this.duration,{
				delay:this.delay,
				x:this.flare.x + this.direction.x*100,
				y:this.flare.y + this.direction.y*100,
				alpha:Math.random()*0.3+0.3,
				onComplete:this.anim.bind(this)
			});
			this.delay = 0;
		},
		fading:function(){
			TweenLite.to(this.flare,this.duration*3,{
				x:this.flare.x + this.direction.x*300,
				y:this.flare.y + this.direction.y*300,
				alpha:0,
				onComplete:this.creating.bind(this)
			});
		},
		anim:function(){
			TweenLite.to(this.flare,this.duration,{
				x:this.flare.x + this.direction.x*100,
				y:this.flare.y + this.direction.y*100,
				alpha:Math.random()*0.3+0.3,
				onComplete:this.fading.bind(this)
			});
		}
	}

	function Particles(){
		this.layer = new PIXI.DisplayObjectContainer();
	}

	function Background(){
		this.flares = [];
		this.layer = new PIXI.DisplayObjectContainer();
	}
	Background.prototype = {
		init:function(){
			var flare = new PIXI.Sprite.fromFrame('flare.png');
			flare.pivot.x = flare.width/2;
			flare.pivot.y = flare.height/2;
			flare.x = 360/2;
			flare.y = 0;
			flare.tint = bgColor;
			flare.alpha = 0.5;
			flare.scale.x = 5;
			flare.scale.y = 3;
			this.layer.addChild(flare);


			var flare = new PIXI.Sprite.fromFrame('flare.png');
			flare.pivot.x = flare.width/2;
			flare.pivot.y = flare.height/2;
			flare.x = 360/2;
			flare.y = 480;
			flare.alpha = 0.5;
			flare.tint = bgColor;
			flare.scale.x = 5;
			flare.scale.y = 2;
			this.layer.addChild(flare);


			var flare = new PIXI.Sprite.fromFrame('flare.png');
			flare.pivot.x = flare.width/2;
			flare.pivot.y = flare.height/2;
			flare.x = 360/2;
			flare.y = 480/2;
			flare.alpha = 0.2;
			flare.tint = bgColor2;
			flare.scale.x = 3;
			flare.scale.y = 5;
			this.layer.addChild(flare);

			for (var i = 0; i < 24; i++) {
				var particle = new Particle(this.layer);
			};

			// for (var i = 0; i < 8; i++) {
			// 	var particle = new ParticleDark(this.layer);
			// };
			// for (var i = 0; i < 16; i++) {
			// 	var particle = new ParticleMini();
			// 	this.layer.addChild(particle.flare);
			// };
			// this.lp = new Particles();
			// this.layer.addChild(lp.layer);

		},
		update:function(){

		}
	}
	return Background;
})();