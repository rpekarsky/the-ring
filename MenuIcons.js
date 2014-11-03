var LockedSprite = (function(){
	function LockedSprite(){
		this.layer = new PIXI.DisplayObjectContainer();

		this.lockedSprite = new PIXI.Sprite.fromFrame('locked');
		this.lockedSprite.pivot.x = this.lockedSprite.width/2;
		this.lockedSprite.pivot.y = this.lockedSprite.height/2;
		this.lockedSprite.tint = 0x404040;

		this.layer.addChild(this.lockedSprite);
		this.layer.visible = false;
	}
	LockedSprite.prototype = {
		show:function(){
			this.layer.visible = true;
		},
		hide:function(){
			this.layer.visible = false;
		}
	}
	return LockedSprite;
})();

var baseIcon = (function(){
	function baseIcon(image,menu){
		this.menu = menu;
		this.layer = menu.IconsLayer;
		this.logo = new PIXI.Sprite.fromFrame(image);
		this.logo.pivot.x = this.logo.width/2;
		this.logo.pivot.y = this.logo.height/2;
		this.logo.x = gameWidth/2;
		this.logo.y = gameHeight/2;
		this.logo.tint = 0x404040;
		this.logo.visible = false;

		this.score = new ScoreLine();
		this.lockedSprite = new LockedSprite();
		this.lockedSprite.layer.x = gameWidth/2 + 55;
		this.lockedSprite.layer.y = gameHeight/2 - 60;

		this.score.layer.x = gameWidth/2;
		this.score.layer.y = 20;

		this.layer.addChild(this.logo);
		this.layer.addChild(this.lockedSprite.layer);
		this.layer.addChild(this.score.layer);
		this.onhide = this.onHide.bind(this);
	}
	baseIcon.prototype = {
		show:function(dir){
			// console.log('show',this);
			// TweenLite.killTweensOf(this.logo);
			// TweenLite.killTweensOf(this.logo.scale);
			this.score.show();

			if(this.hideAnim){
				this.hideAnim.kill();
			}
			if(this.hideAnimScale){
				this.hideAnimScale.kill();
			}
			if(this.locked){
				this.lockedSprite.show();
			}


			this.logo.visible = true;
			this.logo.alpha = 0;
			this.logo.scale.x = 1;
			this.logo.scale.y = 1;

			if(dir == undefined){
				dir = 1;
			}
			this.logo.y = gameHeight/2-50;

			// this.logo.y += 10;
			if(this.showAnim){
				this.showAnim.restart();
			} else {
				this.showAnim = TweenLite.to(this.logo,0.3,{
					alpha:1,
					y:gameHeight/2
				});
			}
		},
		update:function(){

		},
		setLocked:function(){
			this.locked = true;
			
		},
		hide:function(dir){
			this.lockedSprite.hide();
			this.score.hide();
			if(this.showAnim){
				this.showAnim.kill();
			}
			// TweenLite.killTweensOf(this.logo);
			// TweenLite.killTweensOf(this.logo.scale);

			if(dir == undefined){
				dir = 1;
			}

			if(this.hideAnim){
				this.hideAnim.restart();
			} else {
				this.hideAnim = TweenLite.to(this.logo,0.2,{
					alpha:0,
					y:this.logo.y + 50
				});
			}


			if(this.hideAnimScale){
				this.hideAnimScale.restart();
			} else {
				this.hideAnimScale = TweenLite.to(this.logo.scale,0.2,{
					x:0.7,
					y:0.7,
					onComplete:this.onhide
				});
			}
			// console.log('hide');
		},
		onHide:function(){
			this.logo.visible = false;
		},
		select:function(){
		}
	}
	return baseIcon;
})();
var n = 0;
var Icons = {
	Zen:(function() {
		var _super = baseIcon.prototype;
		var Zen = function(menu){
			baseIcon.call(this,'zen.png',menu);
		};
		Zen.prototype = Object.create(_super);
		var p = Zen.prototype;
		p.select = function(){
			states.open(states.states.zen);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold green');
		}
		p.update = function(){
			this.score.set(Score.getHighScore('zen'));
		}
		return Zen;
	})(),
	Koan:(function() {
		var _super = baseIcon.prototype;
		var Koan = function(menu){
			baseIcon.call(this,'koan.png',menu);
			this.setLocked();
		};
		Koan.prototype = Object.create(_super);
		var p = Koan.prototype;
		p.select = function(){
			if(this.locked){
				states.open(states.states.levelBlocked);
				return;
			}
			states.open(states.states.maratron);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold blue');
		}
		p.update = function(){
			this.score.set(Score.getHighScore('koan'));
		}
		return Koan;
	})(),
	Mondo:(function() {
		var _super = baseIcon.prototype;
		var Mondo = function(menu){
			baseIcon.call(this,'mondo.png',menu);
			// this.setLocked();
		};
		Mondo.prototype = Object.create(_super);
		var p = Mondo.prototype;
		p.select = function(){
			if(this.locked){
				states.open(states.states.levelBlocked,{needScore:10});
				return;
			}
			states.open(states.states.mondo);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold coffee');
		}
		p.update = function(){
			this.score.set(Score.getHighScore('mondo'));
		}
		return Mondo;
	})(),
	Dharma:(function() {
		var _super = baseIcon.prototype;
		var Dharma = function(menu){
			baseIcon.call(this,'dharma.png',menu);
			this.setLocked();
		};
		Dharma.prototype = Object.create(_super);
		var p = Dharma.prototype;
		p.select = function(){
			if(this.locked){
				states.open(states.states.levelBlocked,{needScore:10});
				return;
			}
			states.open(states.states.maratron);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold magent');
		}
		p.update = function(){
			this.score.set(Score.getHighScore('dharma'));
		}
		return Dharma;
	})(),
	Resume:(function() {
		var _super = baseIcon.prototype;
		var Resume = function(menu){
			baseIcon.call(this,'resume',menu);
		};
		Resume.prototype = Object.create(_super);
		var p = Resume.prototype;
		p.select = function(){

			if(this.saved_data){
				console.log(this.saved_data);
				states.open(states.states[this.saved_data.type],{data:this.saved_data});
			}
			// states.open(states.states.zen.resume);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold magent');
		}
		p.update = function(){
			this.saved_data = Storage.get('last_game')||0;
			this.score.set(this.saved_data.score);
		}
		return Resume;
	})()
}