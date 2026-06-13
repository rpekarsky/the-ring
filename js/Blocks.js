var Blocks = (function(){
    function Blocks(game){
        this.game = game;
        this.objects = [];
        this.gameobjects = [];
    }
    Blocks.prototype = {
        update:function(){
            for (var i = 0; i < this.objects.length; i++) {
                this.objects[i].update();
            };
        },
        clear:function(){
            var toRemove = []
            for (var i = 0; i < this.gameobjects.length; i++) {
                toRemove.push(this.gameobjects[i]);
            };
            for (var i = 0; i < toRemove.length; i++) {
                toRemove[i].remove();
            };
        },
        find:function(x,y){
            for (var i = 0; i < this.gameobjects.length; i++) {
                if(this.gameobjects[i].x == ab(x,this.gameobjects[i].game.num) && 
                   this.gameobjects[i].y == y) 
                   return this.gameobjects[i];
            };
            return false;
        },
        destroy:function(block){
            for (var i = 0; i < this.objects.length; i++) {
                if(this.objects[i] == block){
                    this.objects.splice(i,1);
                }
            };
        },
        load:function(data){
            this.clearAll();
            for (var i = 0; i < data.length; i++) {
                var bl = this.game.createBlock(data[i].x,data[i].y);
                bl.add();
            };
        },
        save:function(){
            var toSave = [];
            for (var i = 0; i < this.gameobjects.length; i++) {
                var bl = this.gameobjects[i];
                toSave.push({x:bl.x,y:bl.y});
            };
            return toSave;
        },
        clearAll:function(){
            var toRemove = []
            for (var i = 0; i < this.gameobjects.length; i++) {
                toRemove.push(this.gameobjects[i]);
            };
            for (var i = 0; i < toRemove.length; i++) {
                toRemove[i].destroy();
                this.destroy(toRemove[i]);
                this.remove(toRemove[i]);
            };
        },
        remove:function(block){
            for (var i = 0; i < this.gameobjects.length; i++) {
                if(this.gameobjects[i] == block){
                    this.gameobjects.splice(i,1);
                }
            };
        }
    };
    return Blocks;
})();