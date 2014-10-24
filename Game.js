var GameClass = (function(){
	function GameClass(){
		this.num = 24;
		this.height = 6;
		this.blocks = new Blocks();
		this.stage = new PIXI.Stage(0x000000);
		this.blockLayer = new PIXI.DisplayObjectContainer();
		this.blockPopLayer = new PIXI.DisplayObjectContainer();
		this.levelEdgeLayer = new PIXI.DisplayObjectContainer();
		this.layer = new PIXI.DisplayObjectContainer();
		this.rtx = new PIXI.RenderTexture(this.num*20, (this.height+1)*20);
		this.blackBorder = new PIXI.Graphics();
		this.levelEdge = new PIXI.Graphics();
		this.ring = new PIXI.Strip(this.rtx);
	}
	GameClass.prototype = {
		init:function(){
			if(this.inited) return;
			this.solvedRings = 0;
			this.ringAnimScale = 1;
			this.adder = this.createAdder();
	        this.blackBorder.beginFill(0x000000);
	        this.blackBorder.alpha = 0.3;
	        this.blackBorder.drawRect(0, this.height*20-5, this.num*20, 2);
	        this.blackBorder.endFill();


	        this.levelEdge.beginFill(0x000000);
	        this.levelEdge.alpha = 0.1;
	        this.levelEdge.drawRect(0, (this.height-4)*20-5, this.num*20, 2);
	        this.levelEdge.endFill();

			this.ring.x = gameWidth/2;
			this.ring.y = gameHeight/2;
			this.ring.alpha = 1;

	        this.blockPopLayer.addChild(this.blackBorder);
	        this.levelEdgeLayer.addChild(this.levelEdge);
			this.stage.addChild(this.blockLayer);
			this.stage.addChild(this.blockPopLayer);
			this.stage.addChild(this.levelEdgeLayer);
			this.layer.addChild(this.ring)
			basestage.addChild(this.layer);

			this.renderedBinding = rendered.add(this.render.bind(this));
			this.tappedBinding = TouchInput.tapped.add(this.adder.moveUp.bind(this.adder));
			this.turnedCVBinding = TouchInput.turnedCV.add(this.adder.move.bind(this.adder,-1));
			this.turnedCCVBinding = TouchInput.turnedCCV.add(this.adder.move.bind(this.adder,1));

			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			this.turnedCVBinding.active = false;
			this.turnedCCVBinding.active = false;
			this.inited = true;
		},
		close:function(){
			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			this.turnedCVBinding.active = false;
			this.turnedCCVBinding.active = false;
			this.layer.visible = false;
			if(this.onClose){
				this.onClose();
			}
		},
		open:function(){
			this.renderedBinding.active = true;
			this.tappedBinding.active = true;
			this.turnedCVBinding.active = true;
			this.turnedCCVBinding.active = true;
			this.layer.visible = true;



			// this.ring.y = gameHeight/2 + 50;
			// this.ringAnimScale = 0.7;
			// this.ring.scale.y = 0.2;

			// if(this.showAnim){
			// 	this.showAnim.restart();
			// } else {
			// 	this.showAnim = TweenLite.to(this.ring,3,{
			// 		y:gameHeight/2,
			// 		ease:Elastic.easeOut
			// 	});
			// }

			// if(this.showAnimScale){
			// 	this.showAnimScale.restart();
			// } else {
			// 	this.showAnimScale = TweenLite.to(this.ring.scale,4,{
			// 		x:1,
			// 		y:1,
			// 		ease:Elastic.easeOut
			// 	});				
			// }


			if(this.onOpen){
				this.onOpen();
			}
		},
		bulk:function(){
			TweenLite.killTweensOf(this);
			TweenLite.to(this,0.1,{
				ringAnimScale:.95,
			})
			TweenLite.to(this,2,{
				ringAnimScale:1,
				delay:0.1,
				ease:Elastic.easeOut
			})
		},
		setCenterNum:function(num){
			this.centerNumText.setText(num.toString());
			this.bulkText();
		},
		bulkText:function(){
			if(this.centerNumText){
				TweenLite.killTweensOf(this.centerNumText);
				TweenLite.to(this.centerNumText.scale,0.1,{
					x:1.25,
					y:1.25,
				})
				TweenLite.to(this.centerNumText.scale,3,{
					x:1,
					y:1,
					delay:0.1,
					ease:Elastic.easeOut
				})
			}
		},
		resonance:function(){
			TweenLite.killTweensOf(this);
			TweenLite.to(this,0.05,{
				ringAnimScale:1.06,
			})
			TweenLite.to(this,1,{
				ringAnimScale:1,
				delay:.05,
				ease:Elastic.easeOut
			})
		},
		added:function(){
            this.bulk();
            Sound.play('place');
		},
		ringSolved:function(){
			this.solvedRings++
			Sound.play('complete');
			this.check();
		},
		gameover:function(){
			TweenLite.killTweensOf(this);
			this.blocks.clear();
			TweenLite.to(this,0.1,{
				ringAnimScale:1.5,
			})
			TweenLite.to(this,2,{
				ringAnimScale:1,
				delay:.1,
				ease:Elastic.easeOut
			});
			background.removeParticles();
			background.grayscale();
            Sound.play('death');
		},
		render:function(){
			if(this.centerNumText){
		        this.centerNumText.position.x = gameWidth/2 - this.centerNumText.width/2+ this.centerNumText.text.length*1.5+5;
				if(this.centerNumText.text == '0'){
		        	this.centerNumText.position.x = gameWidth/2 + 10 - this.centerNumText.width/2;
				}
		        this.centerNumText.position.y = gameHeight/2 - this.centerNumText.height/2;;
			}


			this.blocks.update();
		    this.rtx.clear();
		    this.rtx.render(this.stage);
		    this.ring.scale.x = this.ringAnimScale;
		    this.ring.scale.y = this.ringAnimScale;


		},
		createAdder:function(){
			var adder = new NewBlocks(3);
			adder.init(this);
			return adder;
		},
		createBlock:function(x,y){
			var block = new Block(x,y);
			block.init(this);
			return block;
		},
		check:function(){
            var completed = true;
            for (var i = 0; i < 24; i++) {
                if(!this.blocks.find(i,5)) completed = false;
            };

            // check to flashing
            for (var i = 0; i < 24; i++) {
                if(this.blocks.find(i,2)){
                    for (var j = 0; j < 10; j++) {
                        var bl = this.blocks.find(i,j);
                        if(bl){
                            bl.flash();
                        }
                    };
                } else {
                    for (var j = 0; j < 10; j++) {
                        var bl = this.blocks.find(i,j);
                        if(bl){
                            bl.removeFlash();
                        }
                    };
                }
            };


            if(completed){
                for (var i = 0; i < 24; i++) {
                    this.blocks.find(i,5).remove();
                };
                this.ringSolved();
            }
            var gameover = false;
            for (var n = 0; n < this.blocks.gameobjects.length; n++) {
                if(this.blocks.gameobjects[n].y < this.height-4){
                    gameover = true
                }
            };
            if(gameover) this.gameover();
        }
	}
	return GameClass;
})();