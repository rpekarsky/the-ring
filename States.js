var States = (function () {
	function States(){
		this.states = {
			title: 			TitleScreen,
			menu: 			MainMenu,
			mondo: 			Mondo,
			zen: 			Zen,
			koan: 			Koan,
			dharma: 		Dharma,
			settings:   	Settings,
			levelBlocked: 	LevelBlocked,
		}
		this.current;
		this.history = [];
	}
	States.prototype = {
		openGame:function(type,options){
			console.log('openGame');
			this.current = type.create();
			this.current.init(options);
			this.current.open();
		},
		open:function(type,options){
			if(type != this.current){
				Vibrate(20);
				if(this.current){
					this.current.close();
					this.history.push({state:this.current,options:this.current.options});
				}
				// console.log(type,type.prototype,type.create);
				if(type.prototype && type.prototype.isGameType){
					this.openGame(type,options);
					return;
				}
				if(typeof type == 'function'){
					if(type.create){
						this.current = type.create();
					} else {
						this.current = new type();
					}
				} else {
					this.current = type;
				}
				this.current.init(options);
				this.current.open();
			}
		},
		back:function(){
			Vibrate(20);
			var historyState = this.history.pop();
			if(historyState){
				var state = historyState.state;
				var options = historyState.options;
				// this.current.close();
				this.open(state,options);
				// state.init(options);
				// state.open();
				// this.current = state;
			}
		}
	}
	return States;
})();