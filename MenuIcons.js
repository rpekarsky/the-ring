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


		this.locked = new PIXI.Sprite.fromFrame('locked');
		this.locked.x = this.locked.width/2;
		this.locked.y = this.locked.height/2;

		this.locked.x = gameWidth/2 + 35;
		this.locked.y = gameHeight/2 - 80;
		this.locked.visible = false;
		this.locked.tint = 0x404040;


		this.layer.addChild(this.logo);
		this.layer.addChild(this.locked);
		this.onhide = this.onHide.bind(this);
	}
	baseIcon.prototype = {
		show:function(dir){
			// console.log('show',this);
			// TweenLite.killTweensOf(this.logo);
			// TweenLite.killTweensOf(this.logo.scale);

			if(this.hideAnim){
				this.hideAnim.kill();
			}
			if(this.hideAnimScale){
				this.hideAnimScale.kill();
			}

			this.logo.visible = true;
			this.locked.visible = true;
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
		hide:function(dir){
			this.locked.visible = false;
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
			baseIcon.call(this,'resume',menu);
		};
		Zen.prototype = Object.create(_super);
		var p = Zen.prototype;
		p.select = function(){
			states.open(states.states.zen);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			background.changeColor('cold green');
		}
		return Zen;
	})(),
	Koan:(function() {
		var _super = baseIcon.prototype;
		var Koan = function(menu){
			baseIcon.call(this,'koan.png',menu);
		};
		Koan.prototype = Object.create(_super);
		var p = Koan.prototype;
		p.select = function(){
			states.open(states.states.zen);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			background.changeColor('cold blue');
		}
		return Koan;
	})(),
	Mondo:(function() {
		var _super = baseIcon.prototype;
		var Mondo = function(menu){
			baseIcon.call(this,'mondo.png',menu);
		};
		Mondo.prototype = Object.create(_super);
		var p = Mondo.prototype;
		p.select = function(){
			states.open(states.states.levelBlocked,{image:'mondo.png'});
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			background.changeColor('cold coffee');
		}
		return Mondo;
	})(),
	Dharma:(function() {
		var _super = baseIcon.prototype;
		var Dharma = function(menu){
			baseIcon.call(this,'dharma.png',menu);
		};
		Dharma.prototype = Object.create(_super);
		var p = Dharma.prototype;
		p.select = function(){
			states.open(states.states.zen);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			background.changeColor('cold magent');
		}
		return Dharma;
	})()
}