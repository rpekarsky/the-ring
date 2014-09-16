var NewBlocks = (function(){
    function NewBlocks(num){
        this.num = num;
        this.type = 0;
        this.blocks = [];
        this.x = 0;
        this.y = 10;
    }
    NewBlocks.prototype = {
        init:function(game){
            this.game = game;
            this.y = game.height;
            // this.overlapBlock = this.game.createBlock(0,this.y,0);
            // this.overlapBlock.hide();
            this.num = game.num;
            // var s = 0;
            // for (var j = 0; j < (Math.random()*3+1); j++) {
            //     var secN = Math.floor(this.num*Math.random()+this.num*.5+2);
            //     var type = (Math.random()>0.5);
            //     for (var i = 0; i < secN; i++) {
            //         this.blocks.push(this.game.createBlock(this.x+i+s,this.y,type));
            //     };
            //     s += secN + 3+Math.floor(Math.random()*4);
            // };
            // this.type = this.type?0:1;
        },
        create:function(count){
            count = 1;
            this.blocks = [];
            var s = 0;
            var type = (Math.random()>0.5);
            this.blocks.push(this.game.createBlock(0,this.y,type));
            // for (var j = 0; j < (Math.random()*3+1); j++) {
            //     var secN = Math.floor(count*Math.random()+count*.5+2);
            //     var type = (Math.random()>0.5);
            //     for (var i = 0; i < secN; i++) {
            //         this.blocks.push(this.game.createBlock(this.x+i+s,this.y,type));
            //     };
            //     s += secN + 3+Math.floor(Math.random()*12);
            // };
            // this.blocks.push(this.game.createBlock(this.x,this.y,0));
        },
        move:function(delta){
            this.x+=delta;
            for (var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].move(this.blocks[i].x+delta,this.y);
            };
        },
        moveUp:function(){
            for (var i = 0; i < this.blocks.length; i++) {
                var bl = this.blocks[i];
                bl.add();
                bl.moveUp();
            };
            this.create();
            // Block.check();
        },
        update:function(){
            // this.graphics.x = this.animx*BlockSize;
            // this.graphics.y = this.animy*BlockSize;
        }
    }
    return NewBlocks;
})();


