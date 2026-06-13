var Dharma = (function () {
	var _super = Koan.prototype;
	function Dharma(){
		Koan.call(this);
		this.type = 'dharma';
		this.deadline = this.createDeadline();
	}
	Dharma.prototype = Object.create(_super);
	var p = Dharma.prototype;
	var instance = false;
	p.levels = [
		{
			color:'green',
			heightMin:4,
			heightMax:3,
			chance:30,
			deadline:6,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:1,
		},
		{
			color:'cold choco',
			heightMin:4,
			heightMax:3,
			chance:50,
			deadline:5,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:2,
		},
		{
			color:'cold magent',
			heightMin:4,
			heightMax:2,
			chance:50,
			deadline:4.5,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:3,
		},
		{
			color:'cold red',
			heightMin:3,
			heightMax:2,
			chance:30,
			deadline:4,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:4,
		},
		{
			color:'cold coffee',
			heightMin:3,
			heightMax:2,
			chance:60,
			deadline:3.5,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:5,
		},
		{
			color:'cold grey',
			heightMin:3,
			heightMax:1,
			chance:40,
			deadline:3,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2,
			multipler:6,
		},
		{
			color:'cold magent',
			heightMin:3,
			heightMax:1,
			chance:60,
			deadline:2.5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold green',
			heightMin:2,
			heightMax:1,
			chance:40,
			deadline:2.5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold coffee',
			heightMin:2,
			heightMax:1,
			chance:60,
			deadline:2,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold grey',
			heightMin:2,
			heightMax:1,
			chance:70,
			deadline:2,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold red',
			heightMin:2,
			heightMax:1,
			chance:70,
			deadline:2,
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