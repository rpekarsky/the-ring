var Koan = (function () {
	var _super = GameClass.prototype;
	function Koan(){
		GameClass.call(this);
		this.type = 'koan';
	}
	Koan.prototype = Object.create(_super);
	var p = Koan.prototype;
	p.levels = [
		{
			color:'cold grey',
			heightMin:4,
			heightMax:3,
			chance:30,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:1,
		},
		{
			color:'cold green',
			heightMin:4,
			heightMax:3,
			chance:50,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:2,
		},
		{
			color:'cold blue',
			heightMin:4,
			heightMax:2,
			chance:50,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:3,
		},
		{
			color:'cold cyan',
			heightMin:3,
			heightMax:2,
			chance:30,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:4,
		},
		{
			color:'cold green',
			heightMin:3,
			heightMax:2,
			chance:60,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:5,
		},
		{
			color:'cold dark blue',
			heightMin:3,
			heightMax:1,
			chance:40,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2,
			multipler:6,
		},
		{
			color:'cold coffee',
			heightMin:3,
			heightMax:1,
			chance:60,
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
			chance:40,
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
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold dark blue',
			heightMin:2,
			heightMax:1,
			chance:70,
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
			this.levelSettings.height = 4;
			this.levelSettings.multipler++;
			background.changeColor();
		} else {
			background.changeColor(this.levelSettings.color);
		}
		this.createBlocks();
	}
	p.newGame = function(){
		_super.newGame.call(this);
		this.blocks.clearAll();
		this.createBlocks();
		this.newBlocks();
	}
	p.newBlocks = function(){
		var s = {
			groupsMin:2,
			groupsMax:4,
			blocksMin:2,
			blocksMax:5
		};
		if(this.levelSettings){
			s = this.levelSettings;
		}
		console.log('newBlocks settings',this.levelSettings);
		var hole = this.getHoleIfExists();
		if(hole && hole.length < 6){
			console.log('create HOLE!');
			this.adder.createByArr(hole);
		} else {
			if(this.getMaxHeight() == 1){
        		this.adder.create(1,1,2,5);
			} else {
        		// this.adder.create(1,4,2,5);
        		this.adder.create(
        			s.groupsMin,
					s.groupsMax,
					s.blocksMin,
					s.blocksMax
				);
			}
		}
	}
	p.check = function(){
		_super.check.call(this);
		this.setCenterNum(this.blocks.gameobjects.length);
	}
	p.createBlocks = function(){		
		var s = {
			heightMin:3,
			heightMax:4,
			chance:30
		};
		if(this.levelSettings){
			s = this.levelSettings;
		}
		var blocks = [];
		for (var i = 0; i < 24; i++) {
			if(Math.random() < (s.chance/100) ){
				// var height = Math.round(Math.random()*2+2)+1;
				var delta = s.heightMax-s.heightMin;
				var height = s.heightMin + Math.round(Math.random()*delta)+1;
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
		this.setCenterNum(this.blocks.gameobjects.length);
		this.bulkText();

		if(this.blocks.gameobjects.length == 0){
			this.levelNum++;
			this.loadLevel(this.levelNum);
		}
	}
	p.added = function(){
		_super.added.call(this);
		this.setCenterNum(this.blocks.gameobjects.length);
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