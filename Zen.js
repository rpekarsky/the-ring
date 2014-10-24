var Zen = (function () {
	var _super = GameClass.prototype;
	function Zen(){
		GameClass.call(this);
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Zen.prototype = Object.create(_super);
	var p = Zen.prototype;
	p.init = function(){
		_super.init.call(this);
		this.newBlocks();


		this.centerNumText = new PIXI.BitmapText("0", {font: "60px Comfortaa", align: "right"});
        this.layer.addChild(this.centerNumText);
		background.changeColor('cold green');
		this.a = 0;
	}
	p.newBlocks = function(){
        this.adder.create(1,3,2,7);
	},
	p.render = function(){
		_super.render.call(this);
	},
	p.gameover = function(){
		_super.gameover.call(this);
		this.a = 0;
		this.setCenterNum(this.a);
	},
	p.ringSolved =function(){
		_super.ringSolved.call(this);
		this.a += 1;
		this.setCenterNum(this.a);
		this.bulkText();
	},
	p.added = function(){
		_super.added.call(this);
        this.newBlocks();
	}
	return Zen;
})();