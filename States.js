var States = (function () {
	function States(){
		this.states = {
			menu: 		MainMenu,
			mondo: 		Mondo,
			zen: 		Zen,
			settings:   Settings,
			levelBlocked: LevelBlocked,
		}
		this.current;
		this.history = [];
	}
	States.prototype = {
		open:function(type,options){
			if(type != this.current){
				if(this.current){
					this.current.close();
					this.history.push({state:this.current,options:this.current.options});
				}
				if(type.create){
					this.current = type.create();
				} else {
					this.current = new type();
				}
				this.current.init(options);
				this.current.open();
			}
		},
		back:function(){
			var historyState = this.history.pop();
			if(historyState){
				var state = historyState.state;
				var options = historyState.options;
				this.current.close();
				state.init(options);
				state.open();
				this.current = state;
			}
		}
	}
	return States;
})();