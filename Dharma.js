var Dharma = (function () {
	var _super = GameClass.prototype;
	function Dharma(){
		GameClass.call(this);
		this.type = 'dharma';
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Dharma.prototype = Object.create(_super);
	var p = Dharma.prototype;
	p.init = function(options){
		if(_super.init.call(this)) return;
		this.newBlocks();
		this.createCenterNum();
		background.changeColor('cold green');

	    this.layer.addChild(this.currentScore.layer);
		this.a = 0;

		if(options){
			if(options.data){
				console.log('loading..',options.data)
				this.load(options.data)
			}
		}
	}
	p.newBlocks = function(){
		var hole = this.getHoleIfExists();
		if(hole && hole.length < 10){
			console.log('create HOLE!');
			this.adder.createByArr(hole);
		} else {
        	this.adder.create(1,3,2,7);
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
		this.a += 1;//Math.round(Math.random()*30+500);
		this.setCenterNum(this.a);
		this.bulkText();
	}
	p.added = function(){
		_super.added.call(this);
        this.newBlocks();
        this.save();
        // this.addLevelBulk();
	}
	var instance = false;
	Dharma.create = function(options){
		var options = options || {};
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Dharma();
		return instance;
	}
	return Dharma;
})();