var NewBlocks = (function(){
    function NewBlocks(num){
        this.num = num;
        this.type = 0;
        this.blocks = [];
        this.x = 0;
        this.y = 10;
    }


    function ab(a,b){
        return (a % b + b) % b;
    }
    function find(x){
        for (var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].x == ab(x,this.game.num)){
                return this.blocks[i];
            }
        };
        return false;
    };

    NewBlocks.prototype = {
        init:function(game){
            this.game = game;
            this.y = game.height;
            this.num = game.num;
            this.blocks = [];
        },
        create:function(groupsMin,groupsMax,blocksMin,blocksMax){
            this.clear();
            count = 1;
            var s = 0;
            for (var j = 0; j < range(groupsMin,groupsMax); j++) {
                var secN = range(blocksMin,blocksMax);
                for (var i = 0; i < secN; i++) {
                    var nx = this.x+i+s;
                    if(!find.call(this,nx)){
                        this.blocks.push(this.game.createBlock(nx,this.y));
                    }
                };
                s += secN + 3+Math.floor(Math.random()*12);
            };
        },
        createByArr:function(array){
            // this.clear();
            this.blocks = [];
            for (var i = 0; i < array.length; i++) {
                this.blocks.push(this.game.createBlock(array[i],this.y));
            };
        },
        clear:function(){
            for (var i = 0; i < this.blocks.length; i++) {
                var bl = this.blocks[i];
                bl.destroy();
            };
            this.blocks = [];
        },
        save:function(){
            var data = [];
            for (var i = 0; i < this.blocks.length; i++) {
                data.push({x:this.blocks[i].x,y:this.blocks[i].y});
            };
            return data;
        },
        load:function(data){
            this.clear();
            for (var i = 0; i < data.length; i++) {  
                this.blocks.push(this.game.createBlock(data[i].x,data[i].y));
            };
        },
        move:function(delta){
            this.x+=delta;
            for (var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].move(this.blocks[i].x+delta,this.y);
            };
            Sound.play(delta > 0 ? 'move-fwd' : 'move-back');
            Vibrate(10);
        },
        show:function(){
            
        },
        hide:function(){
            
        },
        moveUp:function(){
            var time = Date.now();
            if(this.lastTime == undefined){
                this.lastTime = 0;
            }
            if(time > this.lastTime + 100){  
                for (var i = 0; i < this.blocks.length; i++) {
                    var bl = this.blocks[i];
                    bl.add();
                    bl.moveUp();
                };
                this.x += Math.floor(Math.random()*24);
                this.blocks = [];
                this.game.added();
                this.lastTime = time;
            }
            // try{
            //     throw new Error();
            // } catch(e){
            //     console.log(e.stack);
            // }
        },
        update:function(){
        }
    }
    return NewBlocks;
})();


