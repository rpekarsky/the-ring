var Block = (function(){
    var BlockSize = 20;
    function Block(x,y,type){
        this.type = type;
        // console.log(x,y);
        this.falling = false;
        this.x = ab(x,32);
        this.y = y;
        this.animx = this.x;
        this.animy = this.y;
        this.graphics = new PIXI.Graphics();
        this.init();
    }
    function ab(a,b){
     return (a % b + b) % b;
    }
    Block.prototype = {
        objects:[],
        gameobjects:[],
        init:function(){
            if(this.type){
                this.graphics.beginFill(0x3B8686);
            } else {
                this.graphics.beginFill(0x79BD9A);
            }
            // this.graphics.lineStyle(1, 0x505050); 
            this.graphics.drawRect(0, 0, BlockSize, BlockSize);
            this.graphics.pivot.x = BlockSize/2;
            this.graphics.pivot.y = BlockSize/2;
            this.graphics.alpha = 0.3;
            this.graphics.endFill();
            stage.addChild(this.graphics);
            this.objects.push(this);
            this.update();
        },
        getNeibhoors:function(){
            var result = [];
            var nb = Block.find(this.x-1,this.y); if(nb) result.push(nb);
                nb = Block.find(this.x+1,this.y); if(nb) result.push(nb);
                nb = Block.find(this.x,this.y-1); if(nb) result.push(nb);
                nb = Block.find(this.x,this.y+1); if(nb) result.push(nb);
            return (!!result.length)?result:false;
        }
        add:function(){
            this.added = true;
            this.gameobjects.push(this);
        },
        move:function(x,y){
            console.log('move',this.x,x);
            this.x = ab(x,32);
            this.y = y;
            if(this.added){
                TweenLite.to(this,0.2,{
                    animx:this.x,
                    animy:this.y
                });
            } else {
                this.animx = this.x;
                this.animy = this.y;
            }
        },
        remove:function(){
            var findedBlock = Block.find(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveDown();
            }

            TweenLite.to(this.graphics.scale,0.3,{
                x:0,
                y:0,
                onComplete:function(){
                    this.graphics.clear();
                    for (var i = 0; i < stage.children.length; i++) {
                        if(stage.children[i] == this.graphics){
                            stage.removeChildAt(i);
                        }
                    };
                }.bind(this)
            });
            Block.remove(this);
            // Block.check();
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
            // Block.check();
        },
        check:function(){
            var findedBlockLeft = Block.find(this.x-1,this.y);
            var findedBlockRight = Block.find(this.x+1,this.y);
            if(findedBlockLeft && findedBlockRight)
            {
                if(findedBlockLeft.type !== this.type && this.type !== findedBlockRight.type){
                    // console.log('yay!');
                    return true;
                }
            }
            return false;
        },
        moveUp:function(){
            var findedBlock = Block.find(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveUp();
            }
            this.move(this.x,this.y-1);
        },
        update:function(){
            this.graphics.x = this.x*BlockSize + BlockSize/2;
            this.graphics.y = this.animy*BlockSize + BlockSize/2;
        }
    }
    Block.update = function(){
        for (var i = 0; i < Block.prototype.objects.length; i++) {
            Block.prototype.objects[i].update();
        };
    }
    Block.find = function(x,y){
        for (var i = 0; i < Block.prototype.gameobjects.length; i++) {
            if(Block.prototype.gameobjects[i].x == x && Block.prototype.gameobjects[i].y == y) return Block.prototype.gameobjects[i];
        };
        return false;
    }
    Block.check = function(){
        var tmp = [];
        for (var i = 0; i < Block.prototype.gameobjects.length; i++) {
            if(Block.prototype.gameobjects[i].check()){
                tmp.push(Block.prototype.gameobjects[i]);
            }
        };
        for (var i = 0; i < tmp.length; i++) {
            tmp[i].remove();
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