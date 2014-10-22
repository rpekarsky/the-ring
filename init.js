var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;
var PixelRatio = window.devicePixelRatio;
var rendered = new Signal();

var basestage = new PIXI.Stage(0x202020);
var renderer = PIXI.autoDetectRenderer(gameWidth,gameHeight);
var renderTexture = new PIXI.RenderTexture(gameWidth, gameHeight);
var backgroundTexture = new PIXI.RenderTexture(gameWidth/2, gameHeight/2);
var stage = new PIXI.Stage(0x000000);
var bgStage = new PIXI.Stage(0x000000);


PIXI.blendModesWebGL[PIXI.blendModes.OVERLAY] = [renderer.gl.DST_ALPHA,renderer.gl.DST_COLOR];
document.body.appendChild(renderer.view);



var background = new Background;
bgStage.addChild(background.layer);
bgStage.addChild(background.layerDebug);
var aloader = new PIXI.AssetLoader(['spriteSheet.json']);
aloader.addEventListener('onComplete',function(){
	background.init();
	TouchInput.init();
	
	// var logo = new PIXI.Sprite.fromFrame('logo.png');
	// logo.pivot.x = logo.width/2;
	// logo.pivot.y = logo.height/2;
	// logo.x = gameWidth/2;
	// logo.y = gameHeight/2;
	// logo.alpha = 1;
	// basestage.addChild(logo);
	
	quad.update();
	if(window.location.href.match(/mothgames.ru/) || window.location.href.match(/home\/roman/)){
		animate();
	}

},false)
aloader.load();

var Game = new Game();
Score.init();


var quad = new PIXI.Quad(backgroundTexture,renderTexture);
stage.addChild(quad);
function animate() {
	rendered.dispatch();
    requestAnimFrame( animate );    
    Game.render();

    backgroundTexture.clear();
    backgroundTexture.render(bgStage);

    renderTexture.clear();
    renderTexture.render(basestage);
    renderer.render(stage);
}




