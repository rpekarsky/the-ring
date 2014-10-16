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
// setInterval(move,1000/2);
// document.ontouchstart = document.onclick = GoUp;



var lastVec;
var startVec;

function ontouchstart(e){
	var posx = gameWidth/2-e.touches[0].pageX;
	var posy = gameHeight/2-e.touches[0].pageY;
	lastVec = new Victor(posx,posy);
	startVec = lastVec;
}

function ontouchend(e){
	var posx = gameWidth/2-e.changedTouches[0].pageX;
	var posy = gameHeight/2-e.changedTouches[0].pageY;
	var vec = new Victor(posx,posy);
	if(vec.subtract(startVec).length() < 5){
		GoUp();
	}
}


function ontouchmove(e){
	var posx = gameWidth/2-e.touches[0].pageX;
	var posy = gameHeight/2-e.touches[0].pageY;
	var vec = new Victor(posx,posy);
	if(!lastVec){
		lastVec = vec;
		console.log('createVec',lastVec.toString());
	}
	var deltaVec = new Victor(lastVec.x,lastVec.y).subtract(vec);
	var deltaAng = deltaVec.angleDeg();
	if(deltaVec.length() > 20){
		var CV = (vec.clone().norm().cross(lastVec.norm()) < 0);
		if(CV){
			GoLeft();
		} else {
			GoRight();
		}
		lastVec = vec;
	}
}

document.addEventListener('touchmove',ontouchmove,false);
document.addEventListener('touchstart',ontouchstart,false);
document.addEventListener('touchend',ontouchend,false);