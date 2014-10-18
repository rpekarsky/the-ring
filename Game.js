var Game = (function(){
	function Game(){
		this.num = 24;
		this.height = 6;
		this.stage = new PIXI.Stage(0x000000);
		this.blockLayer = new PIXI.DisplayObjectContainer();
		this.blockPopLayer = new PIXI.DisplayObjectContainer();
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
		this.levelEdgeLayer = new PIXI.DisplayObjectContainer();
		this.rtx = new PIXI.RenderTexture(this.num*20, (this.height+1)*20);
		this.blackBorder = new PIXI.Graphics();
		this.levelEdge = new PIXI.Graphics();
		this.ring = new PIXI.Strip(this.rtx);
		this.init();
	}
	Game.prototype = {
		init:function(){
			console.log('Game init');
			this.ringAnimScale = 1;
			this.adder = this.createAdder();
			this.deadline = this.createDeadline();

	        this.blackBorder.beginFill(0x000000);
	        this.blackBorder.alpha = 0.3;
	        this.blackBorder.drawRect(0, this.height*20-5, this.num*20, 2);
	        this.blackBorder.endFill();


	        this.levelEdge.beginFill(0x000000);
	        this.levelEdge.alpha = 0.1;
	        this.levelEdge.drawRect(0, (this.height-4)*20-5, this.num*20, 2);
	        this.levelEdge.endFill();

			this.ring.x = gameWidth/2;
			this.ring.y = gameHeight/2;
			this.ring.alpha = 1;

	        this.blockPopLayer.addChild(this.blackBorder);
	        this.levelEdgeLayer.addChild(this.levelEdge);
			this.stage.addChild(this.blockLayer);
			this.stage.addChild(this.blockPopLayer);
			this.stage.addChild(this.levelEdgeLayer);
			this.stage.addChild(this.deadlineLayer);
			basestage.addChild(this.ring);
		},
		bulk:function(){
			TweenLite.killTweensOf(this);
			TweenLite.to(this,0.1,{
				ringAnimScale:.95,
				// ease:Elastic.easeOut
			})
			TweenLite.to(this,2,{
				ringAnimScale:1,
				delay:0.1,
				ease:Elastic.easeOut
			})

            if(navigator.vibrate){
                navigator.vibrate(50);
            };
		},
		resonance:function(){
			TweenLite.killTweensOf(this);
			TweenLite.to(this,0.05,{
				ringAnimScale:1.06,
				// ease:Elastic.easeOut
			})
			TweenLite.to(this,1,{
				ringAnimScale:1,
				delay:.05,
				ease:Elastic.easeOut
			})
		},
		gameover:function(){
			TweenLite.killTweensOf(this);
			Block.clear();
			TweenLite.to(this,0.1,{
				ringAnimScale:1.5,
				// ease:Elastic.easeOut
			})
			TweenLite.to(this,2,{
				ringAnimScale:1,
				delay:.1,
				ease:Elastic.easeOut
			});
			try{
				ga('send', 'event', 'gameaction', 'gameover', 'score', Score.getScore());
			} catch(e){}
			Score.setScore(0);
			background.removeParticles();
            if(navigator.vibrate){
                navigator.vibrate(200);
            };
		},
		resetDeadline:function(){
			this.deadline.reset();
		},
		render:function(){
			Block.update();
			Deadline.update();	
		    this.rtx.clear();
		    this.rtx.render(this.stage);
		    this.ring.scale.x = this.ringAnimScale;
		    this.ring.scale.y = this.ringAnimScale;
		},
		createAdder:function(){
			var adder = new NewBlocks(3);
			adder.init(this);
			adder.create();

			return adder;
		},
		createDeadline:function(){
			var dl = new Deadline();
			dl.init(this);
			return dl;
		},
		createBlock:function(x,y,type){
			var block = new Block(x,y,type);
			block.init(this);
			return block;
		}
	}
	return Game;
})();