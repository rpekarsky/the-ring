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
        },
        create:function(count){
            count = 1;
            this.blocks = [];
            var s = 0;
            for (var j = 0; j < range(this.game.level.groupsMin,this.game.level.groupsMax); j++) {
                var secN = range(this.game.level.blocksMin,this.game.level.blocksMax);
                for (var i = 0; i < secN; i++) {
                    var nx = this.x+i+s;
                    if(!find.call(this,nx)){
                        this.blocks.push(this.game.createBlock(nx,this.y));
                    }
                };
                s += secN + 3+Math.floor(Math.random()*12);
            };
        },
        move:function(delta){
            this.x+=delta;
            for (var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].move(this.blocks[i].x+delta,this.y);
            };
        },
        moveUp:function(){
            this.game.deadline.reset();
            for (var i = 0; i < this.blocks.length; i++) {
                var bl = this.blocks[i];
                bl.add();
                bl.moveUp();
            };
            this.x += Math.floor(Math.random()*24);
            this.game.added();
            this.create();
        },
        update:function(){
        }
    }
    return NewBlocks;
})();


