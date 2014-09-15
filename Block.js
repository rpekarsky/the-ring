var Block = (function(){
    var BlockSizeX = 20;
    var BlockSizeY = 20;
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
        init:function(){
            this.setType(this.type);
            this.text = new PIXI.Text('0',{font:'regular 12px Arial'});
            // stage.addChild(this.graphics);
            this.show();
            this.graphics.alpha = 0;
            // this.graphics.scale.x = 0;
            TweenLite.to(this.graphics,0.8,{
                alpha:0.5
            });

            this.objects.push(this);
            this.update();
        },
        hide:function(){
            stage.removeChild(this.graphics);
        },
        show:function(){
            stage.addChild(this.graphics);
        },
        setType:function(type){
            this.type = type;
            this.graphics.clear();
            if(this.type){
                this.graphics.beginFill(0x69D2E7);
            } else {
                this.graphics.beginFill(0xFA6900);
            }
            this.graphics.drawRect(0, 0, BlockSizeX, BlockSizeY);
            this.graphics.pivot.x = BlockSizeX/2;
            this.graphics.pivot.y = BlockSizeY/2;
            this.graphics.endFill();
        },
        flash:function(){
            this.graphics.alpha = 1;
            // this.graphics.clear();

            // this.graphics.beginFill(0xFFFFFF);
            // this.graphics.drawRect(0, 0, BlockSizeX, BlockSizeY);
            // this.graphics.pivot.x = BlockSizeX/2;
            // this.graphics.pivot.y = BlockSizeY/2;
            // this.graphics.endFill();

            if(this.flashing) this.flashing.kill();
            this.flashing = TweenLite.to(this.graphics,0.5,{alpha:0.2});
            
        },
        setText:function(str){
            this.text.setText(str);
        },
        getNeibhoors:function(){
            var result = [];
            var nbl = Block.find(this.x-1,this.y); if(nbl) result.push(nbl);
            var nbr = Block.find(this.x+1,this.y); if(nbr) result.push(nbr);
            var nbt = Block.find(this.x,this.y-1); if(nbt) result.push(nbt);
            var nbb = Block.find(this.x,this.y+1); if(nbb) result.push(nbb);
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
            if(this.moveYanim) this.moveYanim.kill();
            // console.log('move',this.x,x);
            var fall = (y>this.y)?true:false;
            var dist = Math.abs(y-this.y);
            var nx = ab(x,32);
            // console.log(this.x,x);
            // if(this.x != x){
            //     this.animx = 1;
            // }
            // if(Math.abs(this.x-ns) )
            var delta = Math.abs(this.x-nx);
            this.y = y;
            this.x = nx;
            if(delta == 1){
                this.moveXanim = TweenLite.to(this,0.1,{
                    animx:this.x
                });             
            } else {
                this.animx = this.x;
            }

            // if(this.added){
                if(fall){
                    this.moveYanim = TweenLite.to(this,0.6,{
                        animy:this.y,
                        delay:0.3*(dist-1),
                        ease: Bounce.easeOut
                    })
                } else {
                    this.moveYanim = TweenLite.to(this,1,{
                        animy:this.y,
                        ease: Elastic.easeOut
                    })
                }
                // TweenLite.to(this,0.1,{
                //     animy:this.y-0.1
                // });
                // TweenLite.to(this,0.1,{
                //     animy:this.y+0.1,
                //     delay:0.1
                // });
                // TweenLite.to(this,0.2,{
                //     animy:this.y,
                //     delay:0.2
                // });
            // } else {
            //     this.animx = this.x;
            //     this.animy = this.y;
            // }
        },
        remove:function(){
            var findedBlock = Block.find(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveDown();
            }
            this.graphics.alpha = 0.2;
            // this.graphics.rotation = Math.PI/180*45;
            // this.graphics.scale.x = 0.5;
            // this.graphics.scale.y = 0.5;
            TweenLite.to(this.graphics.scale,0.1,{
                x:1.5,
                y:1.5
            });

            TweenLite.to(this.graphics,0.4,{
                alpha:0.4
            });

            TweenLite.to(this.graphics,0.1,{
                alpha:0,
                delay:0.3
            });

            TweenLite.to(this.graphics.scale,0.7,{
                x:0,
                y:0,
                delay:0.1,
                onComplete:function(){
                    this.graphics.clear();
                    for (var i = 0; i < stage.children.length; i++) {
                        if(stage.children[i] == this.graphics){
                            stage.removeChildAt(i);
                        }
                    };
                    Block.destroy(this);
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
            this.graphics.x = this.animx*BlockSizeX + BlockSizeX/2;
            this.graphics.y = this.animy*BlockSizeY + BlockSizeY/2;
        }
    }
    Block.update = function(){
        for (var i = 0; i < Block.prototype.objects.length; i++) {
            Block.prototype.objects[i].update();
        };
    }
    Block.find = function(x,y){
        for (var i = 0; i < Block.prototype.gameobjects.length; i++) {
            if(Block.prototype.gameobjects[i].x == ab(x,32) && 
               Block.prototype.gameobjects[i].y == y) 
               return Block.prototype.gameobjects[i];
        };
        return false;
    }
    Block.check = function(){
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
            // console.log('element filtered',filtered.length);
            arrRemoveArr(filtered,arr);
            for (var i = 0; i < filtered.length; i++) {
                // console.log('call check of',filtered[i],i);
                var els = check(filtered[i],arr,result);
            };
            return result;
        };


        for (var n = 0; n < Block.prototype.gameobjects.length; n++) {
            if(inArray(Block.prototype.gameobjects[n],tmp)){
                if(!!tmp.length){
                    // console.log('parse block ',n);
                    var elements = check(Block.prototype.gameobjects[n],tmp,[]);
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].setText(elements.length.toString());
                        if(elements.length > 7){
                            elements[i].flash();
                            elements[i].remove();
                        }
                    };
                }
            }
        };

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