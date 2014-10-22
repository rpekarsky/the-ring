var Game = (function(){
	var levels = [
		{
			deadline:3.5,
			multipler:1,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			toNext:2,
		},
		{
			deadline:3,
			multipler:2,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			toNext:4,
		},
		{
			deadline:2.5,
			multipler:2,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			toNext:5,
		},
		{
			deadline:2,
			multipler:3,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			toNext:5,
		},
		{
			deadline:1.8,
			multipler:3,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			toNext:5,
		},
		{
			deadline:1.5,
			multipler:4,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2,
			toNext:5,
		},
		{
			deadline:1.5,
			multipler:5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			toNext:5,
		}
	]
	function Game(){
		this.levelNum = 0;
		this.level = Object.create(levels[this.levelNum]);
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
			this.solvedRings = 0;
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
            // if(navigator.vibrate){
            //     navigator.vibrate(50);
            // };
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
		added:function(){
            this.bulk();
            this.resetDeadline();
            Sound.play('place');
            Score.addScore(100*this.level.multipler);
		},
		nextLevel:function(){
			this.solvedRings = 0;
			this.levelNum++;
            background.changeColor();
			if(levels[this.levelNum]){
				this.level = Object.create(levels[this.levelNum]);
				console.log('level: '+(this.levelNum+1));
			} else {
				if(this.level.deadline > 0.6){
					this.level.deadline -= 0.1
				}
				this.level.multipler += 1;
				console.log('last level');
			}
			Score.update();
		},
		ringSolved:function(){
			this.solvedRings++
			Sound.play('complete');
			Score.addScore(1000*this.level.multipler);
			console.log('to next level: '+(this.level.toNext-this.solvedRings));
			if(this.solvedRings >= this.level.toNext){
				this.nextLevel();
			}
		},
		gameover:function(){

			this.levelNum = 0;
			this.level = Object.create(levels[0]);
			console.log('level 1');

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
			background.grayscale();
            // if(navigator.vibrate){
            //     navigator.vibrate(200);
            // };
            Sound.play('death');
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
		createBlock:function(x,y){
			var block = new Block(x,y);
			block.init(this);
			return block;
		}
	}
	return Game;
})();