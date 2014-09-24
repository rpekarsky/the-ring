// var Adder = new NewBlocks(3,5);
var Game = new Game();
var Adder = Game.adder;
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
	// Block.check();
	// Adder.move(Math.floor(Math.random()*32)*dir);
	// dir = !dir;
    // console.log('up');
    // Block.check();
}

// function GoDown () {
// 	Adder.move(Adder.x,Adder.y+1);
//     console.log('up');
// }

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
// setInterval(Block.check,100);
setInterval(move,1000/10);
// Mousetrap.bind('down', GoDown);



var blink = new PIXI.Sprite.fromImage('blink_alpha.png');
blink.scale.x = 20;
blink.scale.y = 1;
blink.y = 480/2;
// blink.alpha = 0.3;
blink.blendMode = PIXI.blendModes.OVERLAY;
basestage.addChild(blink);

// PIXI.blendModesWebGL[PIXI.blendModes.OVERLAY] = [renderer.gl.SRC_ALPHA,renderer.gl.SRC_ALPHA]
PIXI.blendModesWebGL[PIXI.blendModes.OVERLAY] = [renderer.gl.DST_ALPHA,renderer.gl.DST_COLOR];

// animate();