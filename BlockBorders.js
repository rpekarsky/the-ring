var BlockBorders = (function () {
	var BlockSize = 20;
	var width = 1.5;
	function BlockBorders(block){
		// this.DOC = new PIXI.DisplayObjectContainer();
		this.gr = new PIXI.Graphics();
		block.DOC.addChild(this.gr);
		this.block = block;
		// this.draw();
	}
	BlockBorders.prototype = {
		draw:function(){
			var nb = this.block.getTypeNeibhoorsBinary();
			// this.gr.clear();
			// this.gr.beginFill(0xffffff);
			// if(nb & 1) this.gr.drawRect(0,0,BlockSize,width);
			// if(nb & 2) this.gr.drawRect(BlockSize-width,0,width,BlockSize);
			// if(nb & 4) this.gr.drawRect(0,BlockSize-width,BlockSize,width);
			// if(nb & 8) this.gr.drawRect(0,0,width,BlockSize);
			// this.gr.endFill();
		}
	}
	return BlockBorders;
})();