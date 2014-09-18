var Block = (function(){
    var BlockSize = 20;
    var FALL_TIMEOUT = 0.6;
    var MOVE_TIMEOUT = 0.1;
    function Block(x,y,type){
        this.type = type;
        this.falling = false;
        this.x = x;
        this.y = y;
        this.animx = this.x;
        this.animy = this.y;
        this.graphics = new PIXI.Graphics();
        this.fakeGraphics = new PIXI.Graphics();
    }
    function ab(a,b){
        return (a % b + b) % b;
    }
    function inArray(el,arr){
        return (arr.indexOf(el) != -1);
    }
    function filter (arr1,arr2){
        var result = [];
        for (var i = 0; i < arr1.length; i++) {
            if(arr2.indexOf(arr1[i]) != -1) result.push(arr1[i]);
        };
        return result;
    };

    function arrRemoveArr(arr1,arr2){
        var toRem = [];
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if(arr1[i] == arr2[j]){
                    toRem.push(arr1[i]);
                }
            };
        };
        for (var i = 0; i < toRem.length; i++) {
            removeEl(toRem[i],arr2);
        };
    };
    function removeEl(el,arr){
        for (var i = 0; i < arr.length; i++) {
            if(arr[i] == el){
                arr.splice(i,1);
            }
        };
    }
    Block.prototype = {
        objects:[],
        gameobjects:[],
        init:function(game){
            this.game = game;
            this.maxx = this.game.num;
            this.setType(this.type);
            this.x = ab(this.x,this.game.num);
            this.y = this.y;
            this.animx = this.x;
            this.animfx = this.x;
            this.animy = this.y;
            this.layer = this.game.blockLayer;
            this.text = new PIXI.Text('0',{font:'regular 12px Arial'});
            // stage.addChild(this.graphics);
            this.show();
            // this.graphics.alpha = 0;
            // this.graphics.scale.x = 0;
            // TweenLite.to(this.graphics,0.2,{
            //     alpha:1
            // });

            this.objects.push(this);
            this.update();
        },
        hide:function(){
            this.layer.removeChild(this.graphics);
            this.layer.removeChild(this.fakeGraphics);
        },
        show:function(){
            this.layer.addChild(this.graphics);
            this.layer.addChild(this.fakeGraphics);
        },
        setType:function(type){
            this.type = type;
            this.graphics.clear();
            // var color = 0x26ADE4;
            var color = 0x505050;
            if(this.type){
                // color = 0xD1E751;
                // color = 0x606060;
                color = 0x909090;
            }
            this.graphics.beginFill(color);
            // this.graphics.drawRoundedRect(0, 0, BlockSize, BlockSize,2);
            this.graphics.drawRect(0, 0, BlockSize, BlockSize-1);
            this.graphics.pivot.x = BlockSize/2;
            this.graphics.pivot.y = BlockSize/2;
            this.graphics.endFill();
            // this.graphics.cacheAsBitmap = true;

            this.fakeGraphics.beginFill(color);
            this.fakeGraphics.drawRect(0, 0, BlockSize, BlockSize-1);
            this.fakeGraphics.pivot.x = BlockSize/2;
            this.fakeGraphics.pivot.y = BlockSize/2;
            this.fakeGraphics.endFill();
        },
        flash:function(){
            this.graphics.beginFill(0xffffff);
            this.graphics.drawRect(BlockSize/4, BlockSize/4, BlockSize/2, BlockSize/2);
            // this.graphics.pivot.x = BlockSize/2;
            // this.graphics.pivot.y = BlockSize/2;
            this.graphics.endFill();
            // if(this.flashing) this.flashing.kill();
            // this.graphics.alpha = 1;
            // this.flashing = TweenLite.to(this.graphics,0.5,{alpha:0.2});
        },
        setText:function(str){
            this.text.setText(str);
        },
        getNeibhoors:function(){
            var result = [];
            var nbl = Block.find(ab(this.x-1,this.maxx),this.y); if(nbl) result.push(nbl);
            var nbr = Block.find(ab(this.x+1,this.maxx),this.y); if(nbr) result.push(nbr);
            var nbt = Block.find(ab(this.x,this.maxx),this.y-1); if(nbt) result.push(nbt);
            var nbb = Block.find(ab(this.x,this.maxx),this.y+1); if(nbb) result.push(nbb);
            return result;
        },
        getTypeNeibhoors:function(){
            var nb = this.getNeibhoors();
            var result = [];
            for (var i = 0; i < nb.length; i++) {
                if(nb[i].type == this.type) result.push(nb[i]);
            };
            return result;
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
                this.fakeGraphics.visible = true;
            } else {
                this.fakeGraphics.visible = false;
            }
             
            if(fall){
                this.moveYanim = TweenLite.to(this,FALL_TIMEOUT,{
                    animy:this.y,
                    ease: Bounce.easeOut
                })
                setTimeout(Block.check,FALL_TIMEOUT*1000);
            } 
            if(raise) {
                this.moveYanim = TweenLite.to(this,0.3,{
                    animy:this.y,
                    // ease: Elastic.easeOut
                });
                setTimeout(Block.check,0.3*1000);
            }
        },
        remove:function(){
            var findedBlock = Block.find(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveDown();
            }
            // this.graphics.alpha = 0.2;
            // this.graphics.rotation = Math.PI/180*45;
            // this.graphics.scale.x = 0.5;
            // this.graphics.scale.y = 0.5;
            // TweenLite.to(this.graphics.scale,0.2,{
            //     x:.5,
            //     y:.5
            // });

            // TweenLite.to(this.graphics,0.4,{
            //     alpha:0.4
            // });

            // TweenLite.to(this.graphics,0.1,{
            //     alpha:0,
            //     delay:0.3
            // });

            TweenLite.to(this.graphics.scale,0.3,{
                x:0,
                y:0,
                // ease:Elastic.easeOut,
                // delay:0,
                onComplete:function(){
                    this.graphics.clear();
                    for (var i = 0; i < this.layer.children.length; i++) {
                        if(this.layer.children[i] == this.graphics){
                            this.layer.removeChildAt(i);
                        }
                    };
                    Block.destroy(this);
                }.bind(this)
            });
            // setTimeout(Block.check,FALL_TIMEOUT*1000);
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
            this.graphics.x = this.animx*BlockSize + BlockSize/2;
            this.graphics.y = this.animy*BlockSize + BlockSize/2-4;

            this.fakeGraphics.x = this.animfx*BlockSize + BlockSize/2;
            this.fakeGraphics.y = this.animy*BlockSize + BlockSize/2-4;
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
        // console.log('check');

        // console.clear();
        var tmp = [];
        for (var i = 0; i < Block.prototype.gameobjects.length; i++) {
            tmp.push(Block.prototype.gameobjects[i]);
        };

        function check(el,arr,result){
            var nb = el.getTypeNeibhoors();
            result.push(el);
            removeEl(el,arr);
            var filtered = filter(nb,arr);
            arrRemoveArr(filtered,arr);
            for (var i = 0; i < filtered.length; i++) {
                var els = check(filtered[i],arr,result);
            };
            return result;
        };


        var hasToRemove = false;
        var gameover = false;
        for (var n = 0; n < Block.prototype.gameobjects.length; n++) {
            if(Block.prototype.gameobjects[n].y < Block.prototype.gameobjects[n].game.height-4){
                
                gameover = true
            }
            if(inArray(Block.prototype.gameobjects[n],tmp)){
                if(!!tmp.length){
                    var elements = check(Block.prototype.gameobjects[n],tmp,[]);
                    for (var i = 0; i < elements.length; i++) {
                        // elements[i].setText(elements.length.toString());

                        if(elements.length >= 6){
                            elements[i].remove();
                            hasToRemove = true;
                        } else if (elements.length == 5){
                            elements[i].flash();
                        }
                    };
                }
            }
        };
        if(hasToRemove) Block.prototype.gameobjects[0].game.resonance();
        if(gameover) Block.prototype.gameobjects[0].game.gameover();
        // while(el){
        //     i++;
        //     el = tmp[i];
        // }
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