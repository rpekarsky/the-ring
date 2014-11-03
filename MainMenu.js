var MainMenu = (function () {
	function MainMenu(){
		this.IconsLayer = new PIXI.DisplayObjectContainer();
		this.MenuStates = [
			new Icons.Zen(this),
			new Icons.Koan(this),
			new Icons.Mondo(this),
			new Icons.Dharma(this),
		]
		// if(){
			this.MenuStates.splice(0,0,new Icons.Resume(this))
		// }
		window.a = this.MenuStates;
		this.state = 0;
		this.rtx = new PIXI.RenderTexture(24*20, 140);
		this.ringStage = new PIXI.Stage(0x000000);
		this.bg = new PIXI.Graphics();
		this.ringLayer = new PIXI.DisplayObjectContainer();
		this.layer = new PIXI.DisplayObjectContainer();
		this.ring = new PIXI.Strip(this.rtx);
	}
	MainMenu.prototype = {
		init:function(){

			if(this.inited){
				// console.log('already inited');	
				return
			}


	        this.bg.beginFill(0x000000);
	        this.bg.alpha = 0.3;
	        this.bg.drawRect(0, 120-5, 24*20, 2);
	        this.bg.endFill();


	        this.bg.beginFill(0x000000);
	        this.bg.alpha = 0.1;
	        this.bg.drawRect(0, 0, 24*20, 100);
	        this.bg.endFill();



			this.ring.x = gameWidth/2;
			this.ring.y = gameHeight/2;
			this.ring.alpha = 1;


			this.ringStage.addChild(this.ringLayer);
			this.ringLayer.addChild(this.bg);
			this.layer.addChild(this.ring);
			this.layer.addChild(this.IconsLayer);


			this.layer.pivot.x = gameWidth/2;
			this.layer.pivot.y = gameHeight/2;

			this.layer.x = gameWidth/2;
			this.layer.y = gameHeight/2;

			// var logo = new PIXI.Sprite.fromFrame('logo.png');
			// logo.pivot.x = logo.width/2;
			// logo.pivot.y = logo.height/2;
			// logo.x = gameWidth/2;
			// logo.y = gameHeight/2;
			// logo.tint = 0x404040;
			// this.layer.addChild(logo);

			

			this.renderedBinding = rendered.add(this.render.bind(this));
			this.tappedBinding = TouchInput.tapped.add(this.select.bind(this));
			this.turnedCVBinding = TouchInput.turnedCV.add(this.next.bind(this));
			this.turnedCCVBinding = TouchInput.turnedCCV.add(this.prev.bind(this));

			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			this.turnedCVBinding.active = false;
			this.turnedCCVBinding.active = false;


			// Mousetrap.bind('down', function(){
			// 	states.open(states.states.menu);
			// }.bind(this));
			TouchInput.back.add(function(){states.back()});

			basestage.addChild(this.layer);
			this.set(this.MenuStates[this.state]);
			this.inited = true;
		},
		next:function(){
			var l = this.MenuStates.length;
			this.set( this.MenuStates[((++this.state%l)+l)%l],1 );

            Sound.play('move');
		},
		prev:function(){
			var l = this.MenuStates.length;
			this.set( this.MenuStates[((--this.state%l)+l)%l],-1 );
            Sound.play('move');
		},
		select:function(){
			if(this.cur){
				this.cur.select();
			}
			Sound.play('place');
			return false;
		},
		set:function(state,dir){
			// console.log(dir);
			if(this.cur == state){
				this.cur.update();
				return;	
			} 
			if(this.cur){
				this.cur.hide(dir);
			}
			this.cur = state;
			this.cur.show(dir);
			this.cur.update();
		},
		close:function(){
			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			this.turnedCVBinding.active = false;
			this.turnedCCVBinding.active = false;
			// this.layer.visible = false;
			// this.ring.visible = false;
			if(this.showAnimScale){
				this.showAnimScale.kill();
			}

			if(this.hideAnim){
				this.hideAnim.restart();
			} else {
				this.hideAnim = TweenLite.to(this.layer.scale,0.2,{
					x:0,
					y:0,
					onComplete:function(){
						this.layer.visible = false;
						this.ring.visible = false;
					}.bind(this)
				});	
			}

		},
		open:function(){
			this.renderedBinding.active = true;
			this.tappedBinding.active = true;
			this.turnedCVBinding.active = true;
			this.turnedCCVBinding.active = true;
			this.ring.visible = true;
			this.layer.visible = true;
			background.changeColor('cold blue');

			// this.layer.y = gameHeight/2 + 50;
			this.layer.y = gameHeight/2;
			this.layer.scale.x = 0.4;
			this.layer.scale.y = 0.4;

			// this.layer.scale.x = -1;
			// this.layer.scale.y = -6;

			// if(this.showAnim){
			// 	this.showAnim.restart();
			// } else {
			// 	this.showAnim = TweenLite.to(this.layer,1,{
			// 		y:gameHeight/2,
			// 		ease:Elastic.easeOut
			// 	});
			// }

			if(this.hideAnim){
				this.hideAnim.kill();
			}
			
			if(this.showAnimScale){
				this.showAnimScale.restart();
			} else {
				this.showAnimScale = TweenLite.to(this.layer.scale,1,{
					x:1,
					y:1,
					ease:Elastic.easeOut
				});				
			}
			console.log('open',this.cur);
			this.cur.update();
		},
		render:function(){
		    this.rtx.clear();
		    this.rtx.render(this.ringStage);
		}
	}
	var instance = false;
	MainMenu.create = function(){
		
		if(instance){
			// console.log('return created');
			return instance;
		}
		instance = new MainMenu();
		return instance;
	}
	return MainMenu;
})();
