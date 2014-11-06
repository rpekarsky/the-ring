var Mondo = (function () {
	var _super = Zen.prototype;

	function Mondo(){
		Zen.call(this);
		this.type = 'mondo';
		this.deadline = this.createDeadline();
		// this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Mondo.prototype = Object.create(_super);
	var p = Mondo.prototype;
	p.levels = [
		{
			color:'cold green',
			rings:1,
			deadline:6,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:1,
		},
		{
			color:'cold blue',
			rings:3,
			deadline:5,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:2,
		},
		{
			color:'cold red',
			rings:5,
			deadline:4,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:3,
		},
		{
			color:'cold red',
			rings:5,
			deadline:3,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:4,
		},
		{
			color:'cold red',
			rings:5,
			deadline:2.5,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:5,
		},
		{
			color:'cold red',
			rings:5,
			deadline:2,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2,
			multipler:6,
		},
		{
			color:'cold red',
			rings:5,
			deadline:1.5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		}
	];

	p.initialization = function(options){
		_super.initialization.call(this,options);
	    // this.layer.addChild(this.deadlineLayer);
	}
	p.createDeadline = function(){
		var dl = new Deadline();
		dl.init(this);
		dl.fired.add(this.onDeadline.bind(this));
		dl.canceled.add(this.startDeadLine.bind(this));
		return dl;
	}
	// p.loadLevelSettings = function(settings){
	// 	_super.loadLevelSettings.call(this,settings);
	// }
	// p.newGame = function(){
	// 	_super.newGame.call(this);
	// 	this.blocks.clearAll();
	// 	this.newBlocks();
	// }
	// p.customLoad = function(data){
	// 	this.rings = data.rings;
	// 	this.setCenterNum(this.rings);
	// }
	// p.customSave = function(data){
	// 	data.rings = this.rings;
	// }
	// p.newBlocks = function(){
	// 	console.log('newBlocks settings',this.levelSettings);
	// 	if(this.levelSettings){
	// 		var s = this.levelSettings;
 //     		this.adder.create(s.groupsMin,s.groupsMax,s.blocksMin,s.blocksMax);
	// 	} else {
	// 		this.adder.create(1,3,2,7);
	// 	}
	// },
	p.added = function(){
		_super.added.call(this);
        this.resetDeadline();
	}
	p.resetDeadline = function(){
		this.deadline.reset();
	}
	p.startDeadLine = function(){
		this.deadline.start(this.levelSettings.deadline);
	}
	p.onDeadline = function(){
	    this.adder.moveUp();
	    this.resetDeadline();
	}
	p.onOpen = function(){
		console.log('onOpen');
		this.deadline.resume();
	}
	p.onClose = function(){
		this.deadline.pause();
	}
	// p.ringSolved = function(){
	// 	_super.ringSolved.call(this);
	// 	this.rings--;
	// 	if(this.rings == 0){
	// 		this.levelNum++;
	// 		this.loadLevel(this.levelNum);
	// 	}
	// 	this.setCenterNum(this.rings);
	// 	this.bulkText();
	// }
	var instance = false;
	Mondo.create = function(options){
		var options = options || {};
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Mondo();
		return instance;
	}
	return Mondo;
})();