var States = (function () {
	function States(){
		this.states = {
			menu: 		MainMenu,
			maratron: 	Maratron,
			zen: 		Zen,
			settings:   Settings,
		}
		this.current;
		this.history = [];
	}
	States.prototype = {
		open:function(type){
			if(type != this.current){
				if(this.current){
					this.current.close();
					this.history.push(this.current);
				}
				if(type.create){
					this.current = type.create();
				} else {
					this.current = new type();
				}
				this.current.init();
				this.current.open();
			}
		},
		back:function(){
			var state = this.history.pop();
			if(state){
				this.current.close();
				state.init();
				state.open();
				this.current = state;
			}
		}
	}
	return States;
})();