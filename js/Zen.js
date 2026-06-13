var Zen = (function () {
	var _super = GameClass.prototype;

	function Zen(){
		GameClass.call(this);
		this.type = 'zen';
		// this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Zen.prototype = Object.create(_super);
	var p = Zen.prototype;
	p.levels = [
		{
			color:'cold green',
			rings:1,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:1,
		},
		{
			color:'cold blue',
			rings:3,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:2,
		},
		{
			color:'cold red',
			rings:5,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:3,
		},
		{
			color:'cold coffee',
			rings:5,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:4,
		},
		{
			color:'cold choco',
			rings:5,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:5,
		},
		{
			color:'cold cyan',
			rings:5,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2,
			multipler:6,
		},
		{
			color:'cold magent',
			rings:5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		}
	];

	p.initialization = function(options){
		_super.initialization.call(this,options);
		this.newBlocks();
		this.createCenterNum();
	    this.layer.addChild(this.currentScore.layer);
	}
	p.loadLevelSettings = function(settings){
		_super.loadLevelSettings.call(this,settings);
		console.log('loadLevelSettings');
		if(!settings){
			this.levelSettings.multipler++;
			background.changeColor();
		} else {
			background.changeColor(this.levelSettings.color);
		}
		this.rings = this.levelSettings.rings;
		this.setCenterNum(this.levelSettings.rings);
	}
	p.newGame = function(){
		_super.newGame.call(this);
		this.blocks.clearAll();
		this.newBlocks();
	}
	p.customLoad = function(data){
		this.rings = data.rings;
		this.setCenterNum(this.rings);
	}
	p.customSave = function(data){
		data.rings = this.rings;
	}
	p.newBlocks = function(){
		console.log('newBlocks settings',this.levelSettings);
		if(this.levelSettings){
			var s = this.levelSettings;
     		this.adder.create(s.groupsMin,s.groupsMax,s.blocksMin,s.blocksMax);
		} else {
			this.adder.create(1,3,2,7);
		}
	},
	p.ringSolved = function(){
		_super.ringSolved.call(this);
		this.rings--;
		if(this.rings == 0){
			this.levelNum++;
			this.loadLevel(this.levelNum);
		}
		this.setCenterNum(this.rings);
		this.bulkText();
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