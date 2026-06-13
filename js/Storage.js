var Storage = (function () {
	var changed = new Signal();
	// changed.add(function(key, ov, nv){
	// 	console.log(key,'changed from',ov,'to',nv);
	// });
	return {
		get:function(key){
			return JSON.parse(localStorage.getItem(key)||null);
		},
		remove:function(key){
			localStorage.removeItem(key);
		},
		set:function(key,value){
			var oldValue = this.get(key);
			localStorage.setItem(key,JSON.stringify(value));
			changed.dispatch(key,oldValue,value);
		},
		changed:changed
	}
})();