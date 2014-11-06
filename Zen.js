var Zen = (function () {
	var _super = GameClass.prototype;

	function Zen(){
		GameClass.call(this);
		this.type = 'zen';
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Zen.prototype = Object.create(_super);
	var p = Zen.prototype;
	p.levels = [
		{
			color:'cold green',
			rings:2,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4
		},
		{
			color:'cold blue',
			rings:3,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4
		},
		{
			color:'cold red',
			rings:5,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2
		},
		{
			color:'cold red',
			rings:5,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2
		},
		{
			color:'cold red',
			rings:5,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2
		},
		{
			color:'cold red',
			rings:5,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2
		},
		{
			color:'cold red',
			rings:5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2
		}
	]
	p.initialization = function(options){
		_super.initialization.call(this,options);
		this.newBlocks();
		this.createCenterNum();
	    this.layer.addChild(this.currentScore.layer);
	}
	p.loadLevelSettings = function(settings){
		_super.loadLevelSettings.call(this,settings);
		console.log('loadLevelSettings');
		background.changeColor(this.levelSettings.color);
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
	// p.loadLevel = function(level){
	// 	_super.loadLevel.call(this,level);
	// }
	p.newBlocks = function(){
		console.log('newBlocks settings',this.levelSettings);
		if(this.levelSettings){
			var s = this.levelSettings;
			// console.log(s.groupsMin,s.groupsMax,s.blocksMin,s.blocksMax);
     		this.adder.create(s.groupsMin,s.groupsMax,s.blocksMin,s.blocksMax);
		} else {
			this.adder.create(1,3,2,7);
		}
	},
	p.gameover = function(){
		_super.gameover.call(this);
	}
	p.ringSolved = function(){
		_super.ringSolved.call(this);
		this.rings--;
		if(this.rings == 0){
			this.levelNum++;
			this.loadLevel(this.levelNum);
		}
		// new NewLevelEffect(5).show(this.layer);
		// background.changeColor();
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