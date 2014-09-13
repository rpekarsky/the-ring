var NewBlocks = (function(){
    function NewBlocks(num,x){
        this.num = num;
        this.type = 0;
        this.blocks = [];
        this.x = x;
        this.y = 30;
        this.init(num);
    }
    NewBlocks.prototype = {
        init:function(num){
            this.num = num;
            this.blocks = [];
            // this.blocks.push(new Block(0,this.y,this.type));
            var s = 0;
            for (var j = 0; j < (Math.random()*3+1); j++) {
                var secN = Math.floor(this.num*Math.random()+1);
                for (var i = 0; i < secN; i++) {
                    this.blocks.push(new Block(this.x+i+s,this.y,this.type));
                };
                s += secN + 1;
            };
            this.type = this.type?0:1;
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
            this.init(Math.floor(Math.random()*8+1));
        },
        update:function(){
            // this.graphics.x = this.animx*BlockSize;
            // this.graphics.y = this.animy*BlockSize;
        }
    }
    return NewBlocks;
})();


