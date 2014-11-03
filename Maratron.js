var Maratron = (function () {
	var _super = GameClass.prototype;
	function Maratron(){
		GameClass.call(this);
		this.type = 'mondo';
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Maratron.prototype = Object.create(_super);
	var p = Maratron.prototype;
	p.init = function(){
		if(_super.init.call(this)) return;
		this.deadline = this.createDeadline();
		this.stage.addChild(this.deadlineLayer);
		this.newBlocks();
		this.createCenterNum();
		this.a = 0;
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
        this.adder.create(2,4,2,6);
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
		this.deadline.start(0.8);
	}
	p.onDeadline = function(){
	    this.adder.moveUp();
	    this.resetDeadline();
	}
	p.render = function(){
		_super.render.call(this);
		this.deadline.update();
	}
	p.gameover = function(){
		_super.gameover.call(this);
		this.a = 0;
		this.setCenterNum(this.a);
	}
	p.ringSolved =function(){
		_super.ringSolved.call(this);
		this.a += 1;
		this.setCenterNum(this.a);
		this.bulkText();
	}
	p.onOpen = function(){
		this.deadline.resume();
	}
	p.onClose = function(){
		this.deadline.pause();
	}
	var instance = false;
	Maratron.create = function(){
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Maratron();
		return instance;
	}
	return Maratron;
})();