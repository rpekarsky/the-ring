var Koan = (function () {
	var _super = GameClass.prototype;
	function Koan(){
		GameClass.call(this);
		this.type = 'koan';
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Koan.prototype = Object.create(_super);
	var p = Koan.prototype;
	p.init = function(options){
		if(_super.init.call(this)) return;
		this.newBlocks();
		this.createCenterNum();
		background.changeColor('cold green');

	    this.layer.addChild(this.currentScore.layer);
		this.a = 0;
		var tt = [
			{x:10,y:2},
			{x:9,y:2},
			{x:8,y:2},
			{x:7,y:2},
			{x:6,y:2},
			{x:5,y:2},
		];
		this.blocks.load(tt);
		if(options){
			if(options.data){
				console.log('loading..',options.data)
				this.load(options.data)
			}
		}
	}
	p.newBlocks = function(){
		var hole = this.getHoleIfExists();
		// console.log(hole);
		if(hole && hole.length < 6){
			console.log('create HOLE!');
			this.adder.createByArr(hole);
		} else {
        	this.adder.create(1,2,2,7);
		}
	},
	p.render = function(){
		_super.render.call(this);
	}
	p.gameover = function(){
		_super.gameover.call(this);
		this.a = 0;
		this.setCenterNum(this.a);
	}
	p.ringSolved =function(){
		_super.ringSolved.call(this);
		// this.a += 1;//Math.round(Math.random()*30+500);
		this.bulkText();
		this.setCenterNum(this.blocks.gameobjects.length);
	}
	p.added = function(){
		_super.added.call(this);
        this.newBlocks();
        this.save();
		this.setCenterNum(this.blocks.gameobjects.length);
        // this.addLevelBulk();
	}
	var instance = false;
	Koan.create = function(options){
		var options = options || {};
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Koan();
		return instance;
	}
	return Koan;
})();