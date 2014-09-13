var Adder = new NewBlocks(3,5);

function GoLeft () {
	Adder.move(-1);
    // console.log('left');
}

function GoRight () {
	Adder.move(1);
    // console.log('right');
}

function GoUp () {
	Adder.moveUp();
	dir = !dir;
    // console.log('up');
    // Block.check();
}

// function GoDown () {
// 	Adder.move(Adder.x,Adder.y+1);
//     console.log('up');
// }

// Mousetrap.bind('left', GoLeft);
// Mousetrap.bind('right', GoRight);
Mousetrap.bind('up', GoUp);
var dir = true;
function move(){
	if(dir){
		GoRight();
	} else {
		GoLeft();
	}
}
setInterval(Block.check,200);
setInterval(move,20);
// Mousetrap.bind('down', GoDown);


animate();