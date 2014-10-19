var Block = (function(){
    var BlockSize = 20;
    var FALL_TIMEOUT = 0.6;
    var MOVE_TIMEOUT = 0.2;
    function Block(x,y){
        this.falling = false;
        this.x = x;
        this.y = y;
        this.animx = this.x;
        this.animy = this.y;
        this.DOC = new PIXI.DisplayObjectContainer();
        this.graphics = new PIXI.Graphics();
        this.flashgraphics = new PIXI.Graphics();
        this.DOC.addChild(this.graphics);
        this.DOC.addChild(this.flashgraphics);
        this.DOC.pivot.x = BlockSize/2;
        this.DOC.pivot.y = BlockSize/2;
        // this.fakeGraphics = new PIXI.Graphics();
    }
    Block.prototype = {
        objects:[],
        gameobjects:[],
        init:function(game){
            this.game = game;
            this.maxx = this.game.num;


            var borderWidth = 2;
            function drawBlock(gr,color,bcolor,borderWidth){
                gr.beginFill(bcolor);
                gr.drawRect(0, 0, BlockSize, BlockSize);
                gr.endFill();
                gr.beginFill(color);
                gr.drawRect(0, borderWidth, BlockSize, BlockSize-borderWidth);   
                gr.endFill();
            }
            this.graphics.clear();

            this.flashgraphics.visible = false;
            this.flashgraphics.beginFill(0x000000);
            this.flashgraphics.drawRect(0,0, BlockSize, BlockSize);
            this.flashgraphics.endFill();

            drawBlock(this.graphics,0x424242,0x353535,borderWidth);


            this.x = ab(this.x,this.game.num);
            this.y = this.y;
            this.animx = this.x;
            this.animfx = this.x;
            this.animy = this.y;
            this.layer = this.game.blockLayer;
            this.show();
            this.objects.push(this);
            this.update();
        },
        hide:function(){
            this.layer.removeChild(this.DOC);
            // this.layer.removeChild(this.fakeGraphics);
        },
        show:function(){
            this.layer.addChild(this.DOC);
            // this.layer.addChild(this.fakeGraphics);
        },
        flashing:function(){
            if(this.flashingAnim){
                this.flashingAnim.kill();
            }
            this.flashgraphics.alpha = 1;
            this.flashingAnim = TweenLite.to(this.flashgraphics,0.2,{
                alpha:0.1,
                onComplete:this.flashing.bind(this)
            });
        },
        flash:function(){
            this.flashgraphics.visible = true;
            if(!this.isFlashing){
                this.flashing();
                this.isFlashing = true;
            }
        },
        removeFlash:function(){
            this.isFlashing = false;
            this.flashgraphics.visible = false;
            if(this.flashingAnim){
                this.flashingAnim.kill();
            }
        },
        setText:function(str){
        },
        add:function(){
            this.added = true;
            this.gameobjects.push(this);
        },
        move:function(x,y){
            if(this.moveXanim) this.moveXanim.kill();
            if(this.moveXFanim) this.moveXFanim.kill();
            if(this.moveYanim) this.moveYanim.kill();
            
            var fall = (y>this.y)?true:false;
            var raise = (this.y>y)?true:false;
            var dist = Math.abs(y-this.y);
            var nx = ab(x,this.game.num);
            var oldX = this.x;
            this.y = y;
            this.x = nx;
            this.animx = oldX;
            this.moveXanim = TweenLite.to(this,MOVE_TIMEOUT,{
                animx:this.x
            });            

            var fakeblockseen = false;
            if(oldX == 0 && this.x == this.game.num-1){
                // console.log("YAY!");
                this.moveXanim.kill();
                this.animx = this.game.num;
                this.animfx = 0;
                this.moveXanim = TweenLite.to(this,MOVE_TIMEOUT,{
                    animx:this.x
                });

                this.moveXFanim = TweenLite.to(this,MOVE_TIMEOUT,{
                    animfx:-1
                });
                fakeblockseen = true;
            }
            if(oldX == this.game.num-1 && this.x == 0){
                this.moveXanim.kill();
                this.animfx = oldX;
                this.animx = -1;
                this.moveXanim = TweenLite.to(this,MOVE_TIMEOUT,{
                    animx:this.x
                });
                this.moveXFanim = TweenLite.to(this,MOVE_TIMEOUT,{
                    animfx:oldX+1
                });
                fakeblockseen = true;
            }
            if(fakeblockseen){
                // this.fakeGraphics.visible = true;
            } else {
                // this.fakeGraphics.visible = false;
            }
             
            if(fall){
                this.moveYanim = TweenLite.to(this,FALL_TIMEOUT,{
                    animy:this.y,
                    ease: Bounce.easeOut
                })
                // setTimeout(Block.check,FALL_TIMEOUT*1000);
            } 
            if(raise) {
                this.moveYanim = TweenLite.to(this,0.3,{
                    animy:this.y,
                    // ease: Elastic.easeOut
                    onComplete:Block.check
                });
                // setTimeout(Block.check,0.3*1000);
            }
        },
        remove:function(){
            var findedBlock = Block.find(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveDown();
            }

            TweenLite.to(this,0.8,{
                animy:this.animy + 5,
            });

            TweenLite.to(this.DOC.scale,0.6,{
                y:0,
                onComplete:function(){
                    this.graphics.clear();
                    for (var i = 0; i < this.layer.children.length; i++) {
                        if(this.layer.children[i] == this.DOC){
                            this.layer.removeChildAt(i);
                        }
                    };
                    Block.destroy(this);
                }.bind(this)
            });
            this.removeFlash();
            Block.remove(this);
        },
        moveDown:function(){
            var findedBlock = Block.find(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveDown();
                this.falling = true;
            } else {
                this.falling = false;
            }

            var findedBlock = Block.find(this.x,this.y+1);
            while(!findedBlock){
                this.y++;
                findedBlock = Block.find(this.x,this.y+1);
            }
            this.move(this.x,this.y+1);
        },
        moveUp:function(){
            var findedBlock = Block.find(this.x,this.y-1);
            // console.log(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveUp();
            }
            this.move(this.x,this.y-1);
        },
        update:function(){
            this.DOC.x = this.animx*BlockSize + BlockSize/2;
            this.DOC.y = this.animy*BlockSize + BlockSize/2-4;

            // this.fakeGraphics.x = this.animfx*BlockSize + BlockSize/2;
            // this.fakeGraphics.y = this.animy*BlockSize + BlockSize/2-4;
        }
    }
    Block.update = function(){
        for (var i = 0; i < Block.prototype.objects.length; i++) {
            Block.prototype.objects[i].update();
        };
    }
    Block.clear = function(){
        var toRemove = []
        for (var i = 0; i < Block.prototype.gameobjects.length; i++) {
            toRemove.push(Block.prototype.gameobjects[i]);
        };
        for (var i = 0; i < toRemove.length; i++) {
            toRemove[i].remove();
        };
    }
    Block.find = function(x,y){
        for (var i = 0; i < Block.prototype.gameobjects.length; i++) {
            if(Block.prototype.gameobjects[i].x == ab(x,Block.prototype.gameobjects[i].game.num) && 
               Block.prototype.gameobjects[i].y == y) 
               return Block.prototype.gameobjects[i];
        };
        return false;
    }
    Block.check = function(){
        var completed = true;
        for (var i = 0; i < 24; i++) {
            if(!Block.find(i,5)) completed = false;
        };

        // check to flashing
        for (var i = 0; i < 24; i++) {
            if(Block.find(i,2)){
                for (var j = 0; j < 10; j++) {
                    var bl = Block.find(i,j);
                    if(bl){
                        bl.flash();
                    }
                };
            } else {
                for (var j = 0; j < 10; j++) {
                    var bl = Block.find(i,j);
                    if(bl){
                        bl.removeFlash();
                    }
                };
            }
        };


        if(completed){
            for (var i = 0; i < 24; i++) {
                Block.find(i,5).remove();
            };
            Game.ringSolved();
        }
        var gameover = false;
        for (var n = 0; n < Block.prototype.gameobjects.length; n++) {
            if(Block.prototype.gameobjects[n].y < Block.prototype.gameobjects[n].game.height-4){
                gameover = true
            }
        };
        if(gameover) Block.prototype.gameobjects[0].game.gameover();
    }

    Block.destroy = function(block){
        for (var i = 0; i < Block.prototype.objects.length; i++) {
            if(Block.prototype.objects[i] == block){
                Block.prototype.objects.splice(i,1);
            }
        };
    }

    Block.remove = function(block){
        for (var i = 0; i < Block.prototype.gameobjects.length; i++) {
            if(Block.prototype.gameobjects[i] == block){
                Block.prototype.gameobjects.splice(i,1);
            }
        };
    }
    return Block;
})();