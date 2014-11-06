var Koan = (function () {
	var _super = GameClass.prototype;
	function Koan(){
		GameClass.call(this);
		this.type = 'koan';
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Koan.prototype = Object.create(_super);
	var p = Koan.prototype;
	p.initialization = function(options){
		this.createBlocks();
		this.levelNum = 1;
		this.newBlocks();
		this.createCenterNum();
		background.changeColor('cold green');

	    this.layer.addChild(this.currentScore.layer);
		this.a = 0;
	}
	p.newBlocks = function(){
		var hole = this.getHoleIfExists();
		// console.log(hole);
		if(hole && hole.length < 6){
			console.log('create HOLE!');
			this.adder.createByArr(hole);
		} else {
			if(this.getMaxHeight() == 1){
        		this.adder.create(1,1,2,5);
			} else {
        		// this.adder.create(1,4,2,5);
        		this.adder.create(1,2,2,4);
			}
		}
		console.log(this.getMaxHeight());
	},
	p.render = function(){
		_super.render.call(this);
	}
	p.check = function(){
		_super.check.call(this);
		this.setCenterNum(this.blocks.gameobjects.length);
	}
	p.gameover = function(){
		_super.gameover.call(this);
		this.a = 0;
		this.setCenterNum(this.a);
		this.createBlocks();
	}
	p.createBlocks = function(){
		var blocks = [];
		for (var i = 0; i < 24; i++) {
			if(Math.random()<0.3){
				// var height = Math.round(Math.random()*2+2)+1;
				var height = Math.round(Math.random()*5)+1;
				// var height = Math.floor(0)+1;
				for (var h = 5; h > height; h--) {
					blocks.push({
						x:i,
						y:h
					});
				};
			}
		};
		this.blocks.load(blocks);
		this.check();
	}
	p.ringSolved =function(){
		_super.ringSolved.call(this);
		// this.a += 1;//Math.round(Math.random()*30+500);
		this.bulkText();
		this.setCenterNum(this.blocks.gameobjects.length);

		if(this.blocks.gameobjects.length == 0){
			this.createBlocks();
			new NewLevelEffect(++this.levelNum).show(this.layer);
			background.changeColor();
		}
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