var MainMenu = (function () {
	
	function MainMenu(){
		this.rtx = new PIXI.RenderTexture(24*20, 140);
		this.stage = new PIXI.Stage(0x000000);
		this.blackBorder = new PIXI.Graphics();
		this.layer = new PIXI.DisplayObjectContainer();
		this.ring = new PIXI.Strip(this.rtx);
	}
	MainMenu.prototype = {
		init:function(){
			if(this.inited) return;

	        this.blackBorder.beginFill(0x000000);
	        this.blackBorder.alpha = 0.3;
	        this.blackBorder.drawRect(0, 100-5, 24*20, 2);
	        this.blackBorder.endFill();


			this.ring.x = gameWidth/2;
			this.ring.y = gameHeight/2;
			this.ring.alpha = 1;

			basestage.addChild(this.ring);
			this.layer.addChild(this.blackBorder);
			this.stage.addChild(this.layer);


			this.renderedBinding = rendered.add(this.render.bind(this));
			// this.tappedBinding = TouchInput.tapped.add(this.adder.moveUp.bind(this.adder));
			// this.turnedCVBinding = TouchInput.turnedCV.add(this.adder.move.bind(this.adder,-1));
			// this.turnedCCVBinding = TouchInput.turnedCCV.add(this.adder.move.bind(this.adder,1));

			// this.renderedBinding.active = false;
			// this.tappedBinding.active = false;
			// this.turnedCVBinding.active = false;
			// this.turnedCCVBinding.active = false;

			this.inited = true;
		},
		close:function(){
			this.renderedBinding.active = false;
			// this.tappedBinding.active = false;
			// this.turnedCVBinding.active = false;
			// this.turnedCCVBinding.active = false;
			this.ring.visible = false;
		},
		open:function(){
			this.renderedBinding.active = true;
			// this.tappedBinding.active = true;
			// this.turnedCVBinding.active = true;
			// this.turnedCCVBinding.active = true;
			this.ring.visible = true;
		},
		render:function(){
			this.blocks.update();
		    this.rtx.clear();
		    this.rtx.render(this.stage);
		    this.ring.scale.x = this.ringAnimScale;
		    this.ring.scale.y = this.ringAnimScale;
		}
	}
	return MainMenu;
})();