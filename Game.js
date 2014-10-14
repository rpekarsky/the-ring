var Game = (function(){
	function Game(){
		this.num = 24;
		this.height = 6;
		this.stage = new PIXI.Stage(0x000000);
		this.blockLayer = new PIXI.DisplayObjectContainer();
		this.blockPopLayer = new PIXI.DisplayObjectContainer();
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
		this.stage.addChild(this.blockLayer);
		// this.blockLayer.alpha = 5;
		this.stage.addChild(this.blockPopLayer);
		this.stage.addChild(this.deadlineLayer);
		this.rtx = new PIXI.RenderTexture(this.num*20, (this.height+1)*20);

		this.blackBorder = new PIXI.Graphics();
        this.blackBorder.beginFill(0x000000);
        this.blackBorder.alpha = 0.3;
        this.blackBorder.drawRect(0, this.height*20-5, this.num*20, 2);
        this.blackBorder.endFill();
        // this.blackBorder.pivot.y = this.height*20;

        this.blockPopLayer.addChild(this.blackBorder);
		
		this.ring = new PIXI.Strip(this.rtx);
		this.ringAnimScale = 1;
		this.adder = this.createAdder();
		this.deadline = this.createDeadline();
		
		this.ring.x = 360/2;
		this.ring.y = 480/2;
		this.ring.alpha = 4;
		basestage.addChild(this.ring);
	}
	Game.prototype = {
		init:function(){

		},
		bulk:function(){
			TweenLite.killTweensOf(this);
			TweenLite.to(this,0.1,{
				ringAnimScale:.9,
				// ease:Elastic.easeOut
			})
			TweenLite.to(this,2,{
				ringAnimScale:1,
				delay:0.1,
				ease:Elastic.easeOut
			})
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
			})
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