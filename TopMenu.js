var TopMenu = (function () {
	function TopMenu(){
		this.IconsLayer = new PIXI.DisplayObjectContainer();
		this.IconsBG = new PIXI.Graphics();
		// this.IconsLayer.addChild(this.IconsBG);
	};	
	TopMenu.prototype = {
		init:function(){
	        // this.IconsBG.alpha = 0.2;
	        // this.IconsBG.beginFill(0x000000);
	        // this.IconsBG.drawRect(0, 0, gameWidth, 42);
	        // this.IconsBG.endFill();
	    	this.IconsLayer.alpha = 0.4;

			this.mIcon = new PIXI.Sprite.fromFrame('m-icon.png');
	        this.mIcon.x = (42+6)*0;
			this.IconsLayer.addChild(this.mIcon);

			this.sIcon = new PIXI.Sprite.fromFrame('s-icon.png');
	        // this.sIcon.x = (42+6)*1;
	        this.sIcon.x = gameWidth-this.sIcon.width;
			this.IconsLayer.addChild(this.sIcon);

			this.vIcon = new PIXI.Sprite.fromFrame('v-icon.png');
	        // this.vIcon.x = (42+6)*2;
	        this.vIcon.y = gameHeight-this.vIcon.height;

			this.IconsLayer.addChild(this.vIcon);

			this.backIcon = new PIXI.Sprite.fromFrame('back-icon.png');
	        this.backIcon.x = gameWidth-this.backIcon.width;
	        this.backIcon.y = gameHeight-this.backIcon.height;
			this.backIcon.visible = false;
			this.IconsLayer.addChild(this.backIcon);

			basestage.addChild(this.IconsLayer);
			
			TouchInput.tapped.add(this.pressOnPanel.bind(this), null, 2);
			// this.back.active = false;
		},
		pressOnPanel:function(touch){
			if(touch.y <= 42){
				if(touch.x >= this.backIcon.x){
					TouchInput.back.dispatch();
				}
				return false;
			}
		},
		showBack:function(){
			// this.back.active = true;
			this.backIcon.visible = true;

		},
		hideBack:function(){
			// this.back.active = false;
			this.backIcon.visible = false;
		}
	}
	return TopMenu;
})();
