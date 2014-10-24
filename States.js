var States = (function () {
	function States(){
		this.states = {
			menu: 		MainMenu,
			maratron: 	Maratron,
			zen: 		Zen,
		}
		this.current;
	}
	States.prototype = {
		open:function(type){
			if(type != this.current){
				if(this.current){
					this.current.close();
				}
				if(type == MainMenu){
					this.current = type.create();
				} else {
					this.current = new type();
				}
				this.current.init();
				this.current.open();
			}
		}
	}
	return States;
})();