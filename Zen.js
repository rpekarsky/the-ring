var Zen = (function () {
	var _super = GameClass.prototype;
	function Zen(){
		GameClass.call(this);
		this.type = 'zen';
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Zen.prototype = Object.create(_super);
	var p = Zen.prototype;
	p.initialization = function(options){
		_super.initialization.call(this,options);
		this.newBlocks();
		this.createCenterNum();
	    this.layer.addChild(this.currentScore.layer);
	}
	p.newGame = function(){
		_super.newGame.call(this);
		this.blocks.clearAll();
		this.newBlocks();
		this.loadLevel(1);
	}
	p.loadLevel = function(){
		_super.loadLevel.call(this);
		background.changeColor('cold green');
		new NewLevelEffect(1).show(this.layer);
	}
	p.newBlocks = function(){
        this.adder.create(1,3,2,7);
	},
	p.render = function(){
		_super.render.call(this);
	}
	p.gameover = function(){
		_super.gameover.call(this);
		this.setCenterNum(0);
	}
	p.ringSolved = function(){
		_super.ringSolved.call(this);
		this.setCenterNum(5);
		new NewLevelEffect(5).show(this.layer);
		background.changeColor();
		this.bulkText();
	}
	p.added = function(){
		_super.added.call(this);
        this.newBlocks();
        this.save();
	}
	var instance = false;
	Zen.create = function(options){
		var options = options || {};
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Zen();
		return instance;
	}
	return Zen;
})();