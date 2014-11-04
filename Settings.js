var CheckBox = (function(){
	function CheckBox(enabled){
		this.sprite = new PIXI.Sprite.fromFrame(enabled?'on':'off');
		this.sprite.pivot.x = this.sprite.width/2;
		this.sprite.pivot.y = this.sprite.height/2;
		this.sprite.tint = 0x404040;
		this.enabled = enabled;
	}
	CheckBox.prototype = {
		toggle:function(){
			this.enabled = !this.enabled;
			this.sprite.setTexture(PIXI.Texture.fromFrame(this.enabled?'on':'off'));
			this.animate();
		},
		animate:function(){
			this.sprite.scale.x = this.sprite.scale.y = 0.0;
			TweenLite.killTweensOf(this.sprite.scale);
			TweenLite.to(this.sprite.scale,0.7,{
				x:1,
				y:1,
				ease:Elastic.easeOut
			});
		}
	}

	return CheckBox;
})();

var SettingsOption = (function(){
	function SettingsOption(name,enabled){
		this.layer = new PIXI.DisplayObjectContainer();
		this.name = name;
		this.sprite = new PIXI.Sprite.fromFrame(this.name);
		this.layer.pivot.x = gameWidth/2;
		this.layer.pivot.y = this.sprite.height/2;
		this.sprite.x = gameWidth/2 - 220/2;
		this.sprite.tint = 0x404040;
		this.checkbox = new CheckBox(enabled||false);
		this.checkbox.sprite.x = this.sprite.x + 200;
		this.checkbox.sprite.y = this.sprite.height/2-3;
		this.layer.addChild(this.sprite);
		this.layer.addChild(this.checkbox.sprite);
		this.layer.visible = false;
	}
	SettingsOption.prototype = {
		toggle:function(){
			this.checkbox.toggle();
			console.log('set',this.name,this.checkbox.enabled)
			Storage.set(this.name,this.checkbox.enabled);
			this.animate();
            Sound.play('move');
            Vibrate(20);
		},
		animate:function(){
			// this.layer.scale.y = 2;
			// TweenLite.killTweensOf(this.layer.scale);
			// TweenLite.to(this.layer.scale,1,{
			// 	// x:1,
			// 	y:1,
			// 	ease:Elastic.easeOut
			// });
		},
		show:function(delay){
			this.layer.visible = false;
			this.layer.scale.x = this.layer.scale.y = 0.1;
			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,1,{
				x:1,
				y:1,
				delay:delay,
				onStart:function(){
					this.layer.visible = true;
					// console.log(this);
				}.bind(this),
				ease:Elastic.easeOut
			});
		},
		getBounds:function(){
			var rect = this.layer.getBounds();
			rect.y = gameHeight - rect.y - rect.height;
			return rect;
		}
	}

	return SettingsOption;
})();

var SettingIcon = (function(){
	function SettingIcon(){

	}
	SettingIcon.prototype = {
		init:function(settings){
			this.backIcon = new PIXI.Sprite.fromFrame('settings');
			this.backIcon.tint = 0x404040;
			this.backIcon.x = gameWidth-this.backIcon.width;
			this.backIcon.y = 3;
			this.bindingIcon = TouchInput.tapped.add(this.toggleSettings.bind(this), null, 2);
			basestage.addChild(this.backIcon);
		},
		toggleSettings:function(touch){

			var rect = this.backIcon.getBounds();
			rect.y = gameHeight - rect.y - rect.height;

			if(rect.contains(touch.x,touch.y)){
				if(states.current instanceof states.states.settings){
					states.back();
				} else {
					states.open(states.states.settings);
				}
				Sound.play('move');
				return false;
			}
		}
	}
	return SettingIcon;
})();



var BackIcon = (function(){
	function BackIcon(){

	}
	BackIcon.prototype = {
		init:function(settings){
			this.backIcon = new PIXI.Sprite.fromFrame('settings');
			this.backIcon.tint = 0x404040;
			this.backIcon.x = 0;
			this.backIcon.alpha = 0;
			this.bindingIcon = TouchInput.tapped.add(this.toggleSettings.bind(this), null, 3);
			basestage.addChild(this.backIcon);
		},
		toggleSettings:function(touch){
			var rect = this.backIcon.getBounds();
			rect.y = gameHeight - rect.y - rect.height;

			if(rect.contains(touch.x,touch.y)){
				states.back();
				return false;
			}
		}
	}
	return BackIcon;
})();


var Settings = (function () {
	function Settings(){
		this.layer = new PIXI.DisplayObjectContainer();

		if(Storage.get('music-opt') == null){
			Storage.set('music-opt',true);
		}
		if(Storage.get('sound-opt') == null){
			Storage.set('sound-opt',true);
		}
		if(Storage.get('vibro-opt') == null){
			Storage.set('vibro-opt',true);
		}

		this.music = new SettingsOption('music-opt',Storage.get('music-opt'));
		this.sound = new SettingsOption('sound-opt',Storage.get('sound-opt'));
		this.vibro = new SettingsOption('vibro-opt',Storage.get('vibro-opt'));
		this.binding = TouchInput.tapped.add(this.processTouch.bind(this), null, 1);
		this.binding.active = false;
		basestage.addChild(this.layer);
	};	
	Settings.prototype = {
		init:function(){
			var padding = 20;
			this.layer.visible = false;
	        // this.backIcon.x = gameWidth-this.backIcon.width;
			// this.backIcon.alpha = 0.5;

			this.music.layer.y = -70;
			this.layer.addChild(this.music.layer);

			this.sound.layer.y = 0;
			this.layer.addChild(this.sound.layer);

			this.vibro.layer.y = 70;
			this.layer.addChild(this.vibro.layer);

			this.binding.active = false;
			this.showed = false;
		},
		processTouch:function(touch){
			if(this.music.getBounds().contains(touch.x,touch.y)){
				this.music.toggle();
			}
			if(this.sound.getBounds().contains(touch.x,touch.y)){
				this.sound.toggle();
			}
			if(this.vibro.getBounds().contains(touch.x,touch.y)){
				this.vibro.toggle();
			}
			// if(touch.y <= 55){
			// 	if(touch.x >= this.backIcon.x){
			// 		TouchInput.back.dispatch();
			// 	}
				return false;
			// }
		},
		toggle:function(){
			if(this.showed){
				// this.close();
				states.back();
			} else {
				states.open(states.states.settings);
				// this.open();
			}
		},
		close:function(){
			TouchInput.enabled = true;
			this.binding.active = false;
			this.animateOut();
			// states.current.open();
		},
		open:function(){
			TouchInput.enabled = false;
			this.layer.visible = true;
			this.binding.active = true;
			this.showed = true;
			// states.current.close();
			this.animate();
		},
		animate:function(){
			this.layer.scale.x = this.layer.scale.y = 0.6;
			this.layer.x = gameWidth/2;
			this.layer.y = gameHeight/2;
			// TweenLite.killTweensOf(this.layer);
			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,0.9,{
				x:1,
				y:1,
				ease:Elastic.easeOut
			});
			this.music.show(0);
			this.sound.show(0.05);
			this.vibro.show(0.10);
		},
		animateOut:function(){
			// this.layer.scale.x = this.layer.scale.y = 0.6;
			this.showed = false;

			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,0.1,{
				x:0,
				y:0,
				onComplete:function(){
					this.layer.visible = false;
				}.bind(this),
				// ease:Elastic.easeOut
			});

			// TweenLite.killTweensOf(this.layer);
			// TweenLite.to(this.layer,0.9,{
			// 	y:gameHeight*2,
			// 	// ease:Easin.easeOut
			// });
			// this.music.show(0.2);
			// this.sound.show(0.3);
			// this.vibro.show(0.4);
		}
	}

	var instance = false;
	Settings.create = function(){
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Settings();
		return instance;
	}
	return Settings;
})();
