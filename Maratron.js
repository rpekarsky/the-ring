var Maratron = (function () {
	var _super = GameClass.prototype;
	function Maratron(){
		GameClass.call(this);
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Maratron.prototype = Object.create(_super);
	var p = Maratron.prototype;
	p.init = function(){
		_super.init.call(this);
		this.deadline = this.createDeadline();
		this.stage.addChild(this.deadlineLayer);
		this.newBlocks();
		background.changeColor('cold coffee');
	}
	p.createDeadline = function(){
		var dl = new Deadline();
		dl.init(this);
		dl.fired.add(this.onDeadline.bind(this));
		dl.canceled.add(this.startDeadLine.bind(this));
		return dl;
	},
	p.newBlocks = function(){
        // this.adder.create(1,1,1,1);
        this.adder.create(1,3,2,7);
	}
	p.added = function(){
		_super.added.call(this);
        this.resetDeadline();
        this.newBlocks();
	}
	p.resetDeadline = function(){
		this.deadline.reset();
	}
	p.startDeadLine = function(){
		this.deadline.start(2);
	}
	p.onDeadline = function(){
	    this.adder.moveUp();
	    this.resetDeadline();
	}
	p.render = function(){
		_super.render.call(this);
		this.deadline.update();
	}
	p.onClose = function(){
		this.deadline.destroy();
	}
	return Maratron;
})();