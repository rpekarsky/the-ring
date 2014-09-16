var Game = (function(){
	function Game(){
		this.num = 3*3;
		this.height = 6;
		this.stage = new PIXI.Stage(0x000000);
		this.rtx = new PIXI.RenderTexture(this.num*20, (this.height+1)*20);
		var bgTex = PIXI.Texture.fromImage('bg.jpg');
		this.ring = new PIXI.Strip(this.rtx);
		this.adder = this.createAdder();
		
		this.ring.x = 320/2;
		this.ring.y = 480/2;
		basestage.addChild(this.ring);
	}
	Game.prototype = {
		init:function(){

		},
		render:function(){
			Block.update();
		    this.rtx.clear();
		    this.rtx.render(this.stage);
		},
		createAdder:function(){
			var adder = new NewBlocks(3);
			adder.init(this);
			adder.create();

			return adder;
		},
		createBlock:function(x,y,type){
			var block = new Block(x,y,type);
			block.init(this);
			return block;
		}
	}
	return Game;
})();