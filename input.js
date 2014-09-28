// var Adder = new NewBlocks(3,5);
var Game = new Game();
var Adder = Game.adder;
function GoLeft () {
	Adder.move(-1);
}

function GoRight () {
	Adder.move(1);
}

function GoUp () {
	Adder.moveUp();
	dir = !dir;
}

Mousetrap.bind('left', GoLeft);
Mousetrap.bind('right', GoRight);
Mousetrap.bind('up', GoUp);
var dir = true;
function move(){
	if(dir){
		GoRight();
	} else {
		GoLeft();
	}
}
setInterval(move,1000/10);
document.ontouchstart = document.onclick = GoUp;
