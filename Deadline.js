var Deadline = (function(){
	var color = 0x404040;
	var objs = [];
    function Deadline(){
        this.fired = new Signal();
        this.canceled = new Signal();
        this.DOC = new PIXI.DisplayObjectContainer();
    	this.graphics = new PIXI.Graphics();
        this.graphicsbg = new PIXI.Graphics();
    	objs.push(this);
    }
    Deadline.prototype = {
    	init:function(game){
    		this.animtween;
            this.alpha = 1;
    		this.game = game;
    		this.layer = game.deadlineLayer;
            
            this.graphicsbg.beginFill(0x000000);
            this.graphicsbg.drawRect(0, 0, this.game.num*20, this.game.height*20);
            this.graphicsbg.endFill();
            this.graphicsbg.alpha = 0.3;
            this.graphicsbg.pivot.y = this.game.height*20;

            this.graphics.beginFill(color);
            this.graphics.drawRect(0, this.game.height*20, this.game.num*20, 2);
            this.graphics.endFill();
            this.graphics.alpha = 2;
            this.graphics.pivot.y = this.game.height*20;
            // this.DOC.addChild(this.graphicsbg);

            this.DOC.addChild(this.graphicsbg);
            this.DOC.addChild(this.graphics);
            this.layer.addChild(this.DOC);
            this.DOC.y = 0;
            this.animy = 0;
            // this.graphics.cacheAsBitmap = true;
            // this.graphicsbg.cacheAsBitmap = true;
            this.reset(true);
    	},

    	reset:function(){
    		if(this.animtween){
    			this.animtween.kill();
    		}
			this.animtween = TweenLite.to(this,0.5,{
                animy:0,
                alpha:-0.5,
				// ease:Elastic.easeOut,
    			onComplete:this.canceled.dispatch
    		});
    	},
        start:function(time){
            if(this.animtween){
                this.animtween.kill();
            }
            this.animtween = TweenLite.to(this,time,{
                animy:this.game.height*20,
                alpha:0.8,
                onComplete:this.fired.dispatch
            });
        },
    	update:function(){
    		this.DOC.y = this.animy-5;
            this.DOC.alpha = this.alpha;
    	},
        destroy:function(){
            if(this.animtween){
                this.animtween.kill();
            }
        }
    };
    Deadline.update = function(){
    	for (var i = 0; i < objs.length; i++) {
    		objs[i].update();
    	};
    };
    return Deadline
})();

