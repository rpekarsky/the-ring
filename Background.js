var Background = (function(){
	var cur = Math.ceil(Math.random()*10)%3;
	cur = 2;
	// DEFAULT
	var bgColor = 0x1a6dff;
	var bgColor2 = 0x16f5ff;

	// RED
	if(cur == 1){	
		var bgColor = 0xE54028;
		var bgColor2 = 0xF18D05;
	}

	// LIGHT
	if(cur == 2){	
		var bgColor = 0x7BDF43;
		var bgColor2 = 0xF0FBFD;
	}

	function Particle(layer){
		this.layer = layer;
		this.flare = new PIXI.Sprite.fromFrame('bokeh.png');
		this.delay = Math.random()*5;
		// this.delay = 0;
		this.creating();
	}
	Particle.prototype = {
		creating:function(){
			var ParticlesContainerWidth = gameWidth;
			var ParticlesContainerHeight = gameHeight;
			if(ParticlesContainerWidth > 300){
				ParticlesContainerWidth = 300;
			}

			var blur = (Math.random()>0.5);
			if(blur){
				this.flare.setTexture(PIXI.Texture.fromFrame('bokeh-blur.png'));
			} else {
				this.flare.setTexture(PIXI.Texture.fromFrame('bokeh.png'));
			}
			this.layer.addChild(this.flare);
			this.duration = Math.random()*2+0.5;
			// this.duration = 1;
			this.direction = {x:Math.random()-0.5,y:Math.random()-0.5};
			this.flare.alpha = 0;
			this.flare.rotation = Math.random()*Math.PI*2;
			this.flare.tint = (Math.random()>0.5)?bgColor2:bgColor;
			this.flare.pivot.x = this.flare.width/2;
			this.flare.pivot.y = this.flare.height/2;

			this.scale = Math.random()+0.2;
			if(blur){
				this.scale = Math.random()*2+0.2;
			}
			this.flare.scale.set(this.scale);

			this.flare.x = Math.random()*ParticlesContainerWidth-ParticlesContainerWidth/2 + gameWidth/2;
			this.flare.y = Math.random()*ParticlesContainerHeight-ParticlesContainerHeight/2 + gameHeight/2;
			this.alpha = Math.random()*0.2+0.4;
			// this.alpha = 1;

			TweenLite.to(this.flare,this.duration,{
				delay:this.delay,
				alpha:this.alpha,
				onComplete:this.anim.bind(this)
			});

			TweenLite.to(this.flare,this.duration*6,{
				x:this.flare.x + this.direction.x*300,
				y:this.flare.y + this.direction.y*300,
			});

			this.delay = 0;
		},
		fading:function(){
			TweenLite.to(this.flare,this.duration*3,{
				alpha:0,
				onComplete:this.creating.bind(this)
			});
		},
		anim:function(){
			TweenLite.to(this.flare,this.duration,{
				alpha:this.alpha,
				onComplete:this.fading.bind(this)
			});
		},
		moveOutside:function(){
			TweenLite.killTweensOf(this.flare);
			var oldPos = new Victor(this.flare.x,this.flare.y);
			var direction = oldPos.subtract(new Victor(gameWidth/2,gameHeight/2)).norm();
			this.delay = Math.random()*5;
			TweenLite.to(this.flare,Math.random()*1.5+0.5,{
				alpha:0,
				x:this.flare.x + direction.x*300,
				y:this.flare.y + direction.y*300,
				onComplete:this.creating.bind(this)
			});
		}
	}

	function Background(){
		this.particles = [];
		this.layer = new PIXI.DisplayObjectContainer();
	}
	Background.prototype = {
		init:function(){

			//CENTER
			var flare = new PIXI.Sprite.fromFrame('bokeh-blur.png');
			flare.pivot.x = flare.width/2;
			flare.pivot.y = flare.height/2;
			flare.x = gameWidth/2;
			flare.y = gameHeight/2;
			flare.alpha = 1;
			flare.tint = bgColor;
			flare.scale.x = 8;
			flare.scale.y = 8;
			this.layer.addChild(flare);

			//TOP
			var flare = new PIXI.Sprite.fromFrame('bokeh-blur.png');
			flare.pivot.x = flare.width/2;
			flare.pivot.y = flare.height/2;
			flare.x = gameWidth/2;
			flare.y = 0;
			flare.tint = bgColor;
			flare.alpha = 1;
			flare.scale.x = 6;
			flare.scale.y = 5;
			this.layer.addChild(flare);

			//BOTTOM
			var flare = new PIXI.Sprite.fromFrame('bokeh-blur.png');
			flare.pivot.x = flare.width/2;
			flare.pivot.y = flare.height/2;
			flare.x = gameWidth/2;
			flare.y = gameHeight-50;
			flare.alpha = 0.6;
			flare.tint = bgColor;
			flare.scale.x = 8;
			flare.scale.y = 2;
			this.layer.addChild(flare);


			for (var i = 0; i < 40; i++) {
				this.particles.push(new Particle(this.layer));
			};

		},
		update:function(){

		},
		removeParticles:function(){
			for (var i = 0; i < this.particles.length; i++) {
				this.particles[i].moveOutside();
			};
		}
	}
	return Background;
})();