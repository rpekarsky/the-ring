var Mondo = (function () {
	var _super = Zen.prototype;
	function Mondo(){
		Zen.call(this);
		this.type = 'mondo';
		this.deadline = this.createDeadline();
	}
	Mondo.prototype = Object.create(_super);
	var p = Mondo.prototype;
	p.levels = [
		{
			color:'cold red',
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
			color:'cold magent',
			rings:5,
			deadline:4,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:3,
		},
		{
			color:'cold cyan',
			rings:5,
			deadline:3,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:4,
		},
		{
			color:'cold coffee',
			rings:5,
			deadline:2.5,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:5,
		},
		{
			color:'cocold choco',
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
	p.createDeadline = function(){
		var dl = new Deadline();
		dl.init(this);
		dl.fired.add(this.onDeadline.bind(this));
		dl.canceled.add(this.startDeadLine.bind(this));
		return dl;
	}
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