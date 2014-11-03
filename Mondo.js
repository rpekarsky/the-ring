var Mondo = (function () {
	var _super = GameClass.prototype;
	function Mondo(){
		GameClass.call(this);
		this.type = 'mondo';
	}
	Mondo.prototype = Object.create(_super);
	var p = Mondo.prototype;
	p.init = function(options){
		console.log('INIt');
		// if(this.deadline){
		// 	this.stage.addChild(this.deadlineLayer);	
		// }
		if(_super.init.call(this)) return;
		this.deadline = this.createDeadline();
		// this.stage.addChild(this.deadlineLayer);
		this.newBlocks();
		this.createCenterNum();
		this.a = 0;
		background.changeColor('cold coffee');
		if(options){
			if(options.data){
				console.log('loading..',options.data)
				this.load(options.data)
			}
		}
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
        this.save();
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
			// if(options.data){
			// 	console.log('loading..',options.data)
			// 	instance.load(options.data)
			// }
			// instance.deadline.resume();
			return instance;
		}
		instance = new Mondo();
		// if(options.data){
		// 	console.log('loading..',options.data)
		// 	instance.load(options.data)
		// }
		return instance;
	}
	return Mondo;
})();