var GameClass = (function(){
	var CurrentScore = function(game){
		this.game = game;
		this.layer = new PIXI.DisplayObjectContainer();

		this.layer.x = gameWidth/2;
		this.layer.y = gameHeight/2;


		this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame('bokeh-blur.png'));
		this.bg.tint = 0x000000;
		this.bg.alpha = 3;
		this.bg.pivot.x = this.bg.width/2;
		this.bg.pivot.y = this.bg.height/2;
		this.bg.width = 300;
		this.bg.height = 300;


		this.layer.addChild(this.bg);

		this.scoreLayer = new PIXI.DisplayObjectContainer();
		this.scoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('yourscore'));
		this.scoreSprite.pivot.x = this.scoreSprite.width/2;
		this.scoreSprite.tint = 0x454545;
        this.scoreLayer.addChild(this.scoreSprite);

		this.scoreText = new PIXI.BitmapText('', {font: "40px Comfortaa", align: "right"});
        this.scoreText.alpha = 0.9;
		this.scoreText.x = - this.scoreText.width/2 + 5;
		this.scoreText.y = 30;
        this.scoreLayer.addChild(this.scoreText);



		this.highScoreLayer = new PIXI.DisplayObjectContainer();
		this.highScoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('highscore'));
		this.highScoreSprite.pivot.x = this.highScoreSprite.width/2;
		this.highScoreSprite.tint = 0x454545;
        this.highScoreLayer.addChild(this.highScoreSprite);

		this.highScoreText = new PIXI.BitmapText('', {font: "40px Comfortaa", align: "right"});
        this.highScoreText.alpha = 0.9;
		this.highScoreText.x = - this.highScoreText.width/2 + 5;
		this.highScoreText.y = 30;
        this.highScoreLayer.addChild(this.highScoreText);



		this.newHighScoreLayer = new PIXI.DisplayObjectContainer();
		this.newHighScoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('new_highscore'));
		this.newHighScoreSprite.pivot.x = this.newHighScoreSprite.width/2;
		this.newHighScoreSprite.tint = 0x454545;
        this.newHighScoreLayer.addChild(this.newHighScoreSprite);


        this.scoreLayer.y = -50;
        this.highScoreLayer.y = 30;
        this.newHighScoreLayer.y = -gameHeight/2+30;

        this.layer.addChild(this.scoreLayer);
        this.layer.addChild(this.highScoreLayer);
        this.layer.addChild(this.newHighScoreLayer);


        this.layer.visible = false;

		this.binding = TouchInput.tapped.add(this.processTouch.bind(this), null, 1);
		this.binding.active = false;

		this.renderedBinding = rendered.add(this.updateScorePos.bind(this));
		this.renderedBinding.active = false;
	}
	CurrentScore.prototype = {
		processTouch:function(){
			this.hide();
			return false;
		},
		show:function(){
			// this.game.close();
			this.renderedBinding.active = true;
			this.binding.active = true;
        	this.layer.visible = true;
        	this.newHighScoreLayer.visible = false;
        	var score = Score.getScore(this.game.type);
        	var highscore = Score.getHighScore(this.game.type);

        	if(score > highscore){
        		this.newHighScoreLayer.visible = true;
        	}

			this.scoreText.setText(score.toString());
	        this.scoreText.alpha = 0.9;

			this.highScoreText.setText(highscore.toString());
	        this.highScoreText.alpha = 0.9;

			// this.scoreLayer.visible = true;
			// this.scoreLayer.scale.x = this.scoreLayer.scale.y = 0;
			// TweenLite.killTweensOf(this.scoreLayer.scale);
			// TweenLite.to(this.scoreLayer.scale,0.7,{
			// 	x:1,
			// 	y:1,
			// 	ease:Elastic.easeOut
			// });
			
		},
		updateScorePos:function(){
			this.scoreText.x = - this.scoreText.width/2 + 5;
			this.highScoreText.x = - this.highScoreText.width/2 + 5;
		},
		hide:function(){
			this.renderedBinding.active = false;
			this.binding.active = false;
        	this.layer.visible = false;
        	this.game.resume();
			this.game.newBlocks();
        	// this.game.open();
			// TweenLite.killTweensOf(this.scoreLayer.scale);
			// TweenLite.to(this.scoreLayer.scale,0.3,{
			// 	x:0,
			// 	y:0,
			// 	onComplete:function(){
			// 		this.scoreLayer.visible = false;
			// 	}.bind(this)
			// });
		}
	}



	function GameClass(){
		this.num = 24;
		this.height = 6;
		this.type = 'none';
		this.blocks = new Blocks(this);
		this.stage = GameClass.stage;
		this.blockLayer = new PIXI.DisplayObjectContainer();
		this.blockPopLayer = new PIXI.DisplayObjectContainer();
		this.levelEdgeLayer = new PIXI.DisplayObjectContainer();
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
		this.layer = new PIXI.DisplayObjectContainer();
		this.rtx = new PIXI.RenderTexture(this.num*20, (this.height+1)*20);
		this.blackBorder = new PIXI.Graphics();
		this.levelEdge = new PIXI.Graphics();
		this.ring = new PIXI.Strip(this.rtx);
	}
	GameClass.stage = new PIXI.Stage(0x000000);
	GameClass.prototype = {
		init:function(){
			Score.setScore(this.type,0);
			while(this.stage.children.length){
				this.stage.removeChildren(0,1);
			}
			this.stage.addChild(this.blockLayer);
			this.stage.addChild(this.blockPopLayer);
			this.stage.addChild(this.levelEdgeLayer);
			this.stage.addChild(this.deadlineLayer);
			if(this.inited) return true;
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

			this.currentScore = new CurrentScore(this);

	        this.blockPopLayer.addChild(this.blackBorder);
	        this.levelEdgeLayer.addChild(this.levelEdge);
			this.layer.addChild(this.ring)
			basestage.addChild(this.layer);

			this.renderedBinding = rendered.add(this.render.bind(this));
			this.tappedBinding = TouchInput.tapped.add(this.adder.moveUp.bind(this.adder));
			this.turnedCVBinding = TouchInput.turnedCV.add(this.adder.move.bind(this.adder,-1));
			this.turnedCCVBinding = TouchInput.turnedCCV.add(this.adder.move.bind(this.adder,1));

			this.scoreText = new PIXI.BitmapText('', {font: "25px Comfortaa", align: "right"});
	        this.scoreText.alpha = 0.9;
			this.scoreText.x = 25;
			this.scoreText.y = 3;
	        this.layer.addChild(this.scoreText);

			this.scoreIcon = new PIXI.Sprite.fromFrame('star');
	        this.scoreIcon.tint = 0x404040;
	        this.scoreIcon.scale.set(0.7);
			this.scoreIcon.x = 3;
			this.scoreIcon.y = 3;
	        this.layer.addChild(this.scoreIcon);


	        this.layer.addChild(this.currentScore.layer);

			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			this.turnedCVBinding.active = false;
			this.turnedCCVBinding.active = false;
			this.updateScore();
			this.inited = true;
		},
		save:function(){
			var data = {
				adder:this.adder.save(),
				blocks:this.blocks.save(),
				type:this.type,
				score:Score.getScore(this.type),
			};
			Storage.set('last_game',data);
		},
		pause:function(){
			if(this.deadline){
				this.deadline.pause();
			}

			if(this.adder){
				this.adder.hide();
			}

			if(this.centerNumText){
				this.centerNumText.visible = false;
			}
		},
		resume:function(){
			if(this.deadline){
				this.deadline.resume();
			}

			if(this.adder){
				this.adder.show();
			}

			if(this.centerNumText){
				this.centerNumText.visible = true;
			}
		},
		load:function(data){
			this.adder.load(data.adder);
			this.blocks.load(data.blocks);
			this.setScore(data.score);
			console.log('loaded',data);
		},
		addLevelBulk:function(){
			var blobSplat = new PIXI.Sprite.fromFrame('bokeh.png');
			blobSplat.pivot.x = blobSplat.width/2;
			blobSplat.pivot.y = blobSplat.height/2;
			blobSplat.x = 5;
			blobSplat.y = 15;
			blobSplat.tint = 0x000000;
			// blobSplat.tint = 0xFFFFFF;
			blobSplat.alpha = 0.5;
			blobSplat.width = 60;
			blobSplat.height = 60;

			basestage.addChild(blobSplat);

			TweenLite.to(blobSplat,1,{
				alpha:0.03,
				width:700,
				height:700,
				onComplete:function(){
					basestage.removeChild(blobSplat)
				}
			});
		},
		close:function(){
			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			this.turnedCVBinding.active = false;
			this.turnedCCVBinding.active = false;
			this.layer.visible = false;
			// topMenu.hideBack();
			if(this.onClose){
				this.onClose();
			}
			this.save();
		},
		open:function(){
			this.renderedBinding.active = true;
			this.tappedBinding.active = true;
			this.turnedCVBinding.active = true;
			this.turnedCCVBinding.active = true;
			this.layer.visible = true;

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
		createCenterNum:function(){
			// this.centerNumText = new PIXI.BitmapText("0", {font: "60px Comfortaa", align: "right"});
			this.centerNumText = new PIXI.BitmapText("0", {font: "50px Comfortaa", align: "right"});
			this.centerNumText.alpha = 0.9;
	        this.layer.addChild(this.centerNumText);
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

            Vibrate(40);
            this.addScore(50);


		},
		setScore:function(score){
			console.log('set score to',score);
			Score.setScore(this.type,score);
			this.updateScore();
		},
		addScore:function(score){
			Score.addScore(this.type,score);
			this.updateScore();
		},
		ringSolved:function(){
			this.solvedRings++
			Sound.play('complete');
			this.addScore(500);
			Vibrate(60);
			this.check();
		},
		updateScore:function(){
			var scoreText = Score.getScore(this.type).toString();
			this.scoreIcon.visible = true;
			if(Score.getScore(this.type) == 0){
				this.scoreIcon.visible = false;
				scoreText = '';
			}
			this.scoreText.setText(scoreText);
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
			this.currentScore.show();
			this.pause();
			this.adder.clear();
			Score.updateHighScore(this.type);
            this.setScore(0);
            Vibrate(260);
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
		getHoleIfExists:function(){
			var holes = [];
            for (var i = 0; i < 24; i++) {
                if(!this.blocks.find(i,5)){
                	holes.push(i);
                }
            };
            if(!holes.length) return false;

            var hole = [];
            var holeStart = holes[0];
            // console.log(holeStart);
            var nextI = 1;
            var prevI = 1;
            var next = ab(holeStart+nextI,this.num);
            var prev = ab(holeStart-prevI,this.num);
            hole.push(holes[0]);
            while(inArray(prev,holes) && !inArray(prev,hole)){
            	// console.log('add prev',prev);
            	hole.push(prev);
            	prevI++;
            	prev = ab(holeStart-prevI,this.num);
            }
            while(inArray(next,holes) && !inArray(next,hole)){
            	// console.log('add next',next);
            	hole.push(next);
            	nextI++;
            	next = ab(holeStart+nextI,this.num);
            	// console.log('search',next);
            }
            // console.log(hole,holes);

            if(hole.length != holes.length) return false;
            return hole;
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